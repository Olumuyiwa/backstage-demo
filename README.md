
# **🚀 Step-by-Step Guide to Setting Up Backstage with Docker and Deploying to GCP**
This guide will help you:
1. **Install Backstage** as a standalone application.
2. **Run Backstage with Docker** using **PostgreSQL** as the database.
3. **Deploy Backstage to GCP**.

---

## **📌 Prerequisites**
Before getting started, make sure you have:
✅ **Docker & Docker Compose** installed → [Install Docker](https://docs.docker.com/get-docker/)  
✅ **Node.js (v18 or later) & Yarn** installed → [Install Node.js & Yarn](https://nodejs.org/)  
✅ **GCP Account & Project Setup** → [Sign up for GCP](https://cloud.google.com/)  

---

# **🛠️ Part 1: Setup Backstage Locally with PostgreSQL and Docker**
## **Step 1: Create a New Backstage App**
First, create a new Backstage project:

```sh
npx @backstage/create-app
```

Navigate into the project:

```sh
cd my-backstage-app
```

---

## **Step 2: Configure PostgreSQL as the Database**
By default, Backstage uses SQLite. To switch to PostgreSQL:

1️⃣ Install PostgreSQL dependencies:

```sh
yarn add pg pg-hstore
```

2️⃣ Modify `app-config.yaml` to use PostgreSQL:

Edit the `packages/backend/app-config.yaml` file:

```yaml
# Use PostgreSQL instead of SQLite
backend:
  database:
    client: pg
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
      database: ${POSTGRES_DB}
```

---

## **Step 3: Create a Dockerfile for Backstage**
Inside `packages/backend/`, create a **Dockerfile**:

```dockerfile
# Stage 1: Build stage
FROM node:20-bullseye-slim as build

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    python3 g++ make build-essential libsqlite3-dev ca-certificates curl git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production

# Copy the entire project
COPY . .

# Build Backstage
RUN yarn tsc && yarn build:backend

# Stage 2: Runtime stage
FROM node:20-bullseye-slim

WORKDIR /app

# Copy necessary files from the build stage
COPY --from=build /app /app

# Set permissions
RUN chown -R node:node /app

USER node
ENV NODE_ENV=production

# Expose Backstage port
EXPOSE 7007

# Define the entrypoint
ENTRYPOINT ["node", "packages/backend", "--config", "app-config.yaml"]
```

---

## **Step 4: Create a Docker Compose File**
In the root of your project, create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: backstage-db
    restart: always
    environment:
      POSTGRES_USER: backstage
      POSTGRES_PASSWORD: backstage
      POSTGRES_DB: backstage_plugin_app
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backstage:
    build: .
    container_name: backstage-app
    restart: always
    depends_on:
      - postgres
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_PORT: 5432
      POSTGRES_USER: backstage
      POSTGRES_PASSWORD: backstage
      POSTGRES_DB: backstage_plugin_app
    ports:
      - "7007:7007"

volumes:
  postgres_data:
```

---

## **Step 5: Build and Run Backstage in Docker**
Run the following command:

```sh
docker-compose up --build
```

✅ After a few minutes, open your browser and go to:

```
http://localhost:7007
```

🎉 **Backstage is now running locally with PostgreSQL!**  

---

# **☁️ Part 2: Deploy Backstage to GCP**
Now, let's deploy Backstage to **Google Cloud Run** using **Cloud SQL (PostgreSQL)**.

---

## **Step 6: Create a Cloud SQL Instance**
1️⃣ Go to **Google Cloud Console** → **SQL** → **Create Instance**  
2️⃣ Select **PostgreSQL** and choose a version (e.g., **PostgreSQL 15**).  
3️⃣ Set:
   - **Instance ID:** `backstage-db`
   - **Username:** `backstage`
   - **Password:** `your-secure-password`
   - **Database Name:** `backstage_plugin_app`
4️⃣ Enable **Public IP Access** (or use a private VPC if needed).  
5️⃣ Click **Create** and wait for it to be ready.

---

## **Step 7: Configure Backstage for Cloud SQL**
Modify `app-config.production.yaml`:

```yaml
backend:
  database:
    client: pg
    connection:
      host: your-cloud-sql-instance-ip
      port: 5432
      user: backstage
      password: your-secure-password
      database: backstage_plugin_app
```

---

## **Step 8: Build and Push the Docker Image to Google Container Registry**

Prerequisite : install gcloud by following this link - https://cloud.google.com/sdk/docs/install#mac 

1️⃣ Authenticate with GCP:

```sh
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

2️⃣ Build and tag the Docker image:

```sh

docker build -t gcr.io/YOUR_PROJECT_ID/backstage .

OR 

docker build -t gcr.io/YOUR_PROJECT_ID/backstage -f packages/backend/Dockerfile .

E.g. 

docker build -t gcr.io/northern-cooler-448817-b0/backstage -f packages/backend/Dockerfile .

or 

docker build --platform linux/amd64 -t gcr.io/northern-cooler-448817-b0/backstage  -f packages/backend/Dockerfile .

```

3️⃣ Push the image to Google Container Registry:

Prerequisites 

```shell

gcloud projects add-iam-policy-binding northern-cooler-448817-b0 \
  --member="user:your-email@gmail.com" \
  --role="roles/artifactregistry.admin" \
  --role="roles/artifactregistry.createOnPushRepoAdmin" \
  --role="roles/artifactregistry.writer" \
  --role="roles/cloudbuild.editor" \
  --role="roles/cloudbuild.serviceAgent" \
  --role="roles/run.admin" \
  --role="roles/iam.serviceAccountUser" \
  --role="roles/serviceusage.serviceUsageAdmin" \
  --role="roles/storage.admin" \
  --role="roles/viewer"

  e.g 

  gcloud projects add-iam-policy-binding northern-cooler-448817-b0 \
  --member="user:olfo20250124@gmail.com" \
  --role="roles/artifactregistry.admin" \
  --role="roles/artifactregistry.createOnPushRepoAdmin" \
  --role="roles/artifactregistry.writer" \
  --role="roles/cloudbuild.editor" \
  --role="roles/cloudbuild.serviceAgent" \
  --role="roles/run.admin" \
  --role="roles/iam.serviceAccountUser" \
  --role="roles/serviceusage.serviceUsageAdmin" \
  --role="roles/storage.admin" \
  --role="roles/viewer"

```

```sh
docker push gcr.io/YOUR_PROJECT_ID/backstage

E.g

docker push gcr.io/northern-cooler-448817-b0/backstage
```

---

## **Step 9: Deploy Backstage to Cloud Run**
1️⃣ Deploy the Backstage app:

```sh
gcloud run deploy backstage \
  --image gcr.io/YOUR_PROJECT_ID/backstage \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --set-env-vars POSTGRES_HOST=your-cloud-sql-instance-ip,POSTGRES_PORT=5432,POSTGRES_USER=backstage,POSTGRES_PASSWORD=your-secure-password,POSTGRES_DB=backstage_plugin_app
```

2️⃣ Wait for the deployment to complete.  

✅ **Your Backstage app is now running on GCP!** 🎉  

Copy the **Cloud Run URL** from the terminal and open it in your browser.

---

# **🎯 Summary**
✅ Installed Backstage and configured it for PostgreSQL.  
✅ Created a **Dockerfile** and **docker-compose.yml**.  
✅ Ran Backstage **locally** using Docker and PostgreSQL.  
✅ Set up **Cloud SQL (PostgreSQL)** on GCP.  
✅ Built and deployed Backstage to **Google Cloud Run**.  

🚀 **Your Backstage app is now running in the cloud!** 🚀  

Some Docker and gcloud commands that were ru successfully

```bash

# list the regions
gcloud run regions list

# deploy on gloud run 
gcloud run deploy backstage \
--image gcr.io/northern-cooler-448817-b0/backstage \
--platform managed \
--region us-central1 \
--allow-unauthenticated \
--set-env-vars POSTGRES_HOST=35.202.116.158,POSTGRES_PORT=5432,POSTGRES_USER=backstage,POSTGRES_PASSWORD=your-secure-password,POSTGRES_DB=backstage_plugin_app

# docker push to gcp 
docker push gcr.io/northern-cooler-448817-b0/backstage

# check the type of architecture for the image generated 
docker inspect gcr.io/northern-cooler-448817-b0/backstage:latest 

# check the type of architecture for the image generated 
docker inspect gcr.io/northern-cooler-448817-b0/backstage:latest |  grep -i arch

# most gcp images may work with linux/amd64 platforms
docker build --platform linux/amd64 -t gcr.io/northern-cooler-448817-b0/backstage  -f packages/backend/Dockerfile .

# docker push to gcp 
docker push gcr.io/northern-cooler-448817-b0/backstage

# deploy on gloud run 
gcloud run deploy backstage \
--image gcr.io/northern-cooler-448817-b0/backstage \
--platform managed \
--region us-central1 \
--allow-unauthenticated \
--set-env-vars POSTGRES_HOST=35.202.116.158,POSTGRES_PORT=5432,POSTGRES_USER=backstage,POSTGRES_PASSWORD=your-secure-password,POSTGRES_DB=backstage_plugin_app,BACKSTAGE_BASE_URL=https://backstage-54738136311.us-central1.run.app


```
# Using Docker compose to run both postgres and backstage 
Here's the updated Dockerfile with the necessary fixes for running Backstage with PostgreSQL in production. It includes:  

- ✅ **Database environment variables**  
- ✅ **Ensuring PostgreSQL service is reachable**  
- ✅ **Using Docker best practices**  

### **Updated Dockerfile**
```dockerfile
# Stage 1: Build stage
FROM node:20-bullseye-slim as build

# Install necessary dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 g++ make build-essential libsqlite3-dev ca-certificates curl git && \
    apt-get install -y --fix-missing git || (sleep 10 && apt-get install -y --fix-missing git) && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --network-timeout 300000 || yarn install --network-timeout 300000 && rm -rf "$(yarn cache dir)"

# Copy the entire project into the container
COPY . .

# Stage 2: Runtime stage
FROM node:20-bullseye-slim

# Set the working directory in the container
WORKDIR /app

# Copy necessary files from the build stage
COPY --from=build /app /app

# Copy the repo skeleton to avoid unnecessary cache invalidation
COPY --from=build /app/yarn.lock /app/package.json /app/packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

# Install production dependencies
RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"

# Copy the backend bundle and configuration files
COPY --from=build /app/packages/backend/dist/bundle.tar.gz /app/app-config*.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

# Set permissions for the application directory
RUN chown -R node:node /app

# Switch to the 'node' user for least-privilege operation
USER node

# Set the environment variable for production
ENV NODE_ENV=production

# Expose Backstage default port
EXPOSE 7007

# Set environment variables for Backstage & Database
ENV BACKSTAGE_APP_PORT=7007
ENV POSTGRES_HOST=postgres
ENV POSTGRES_PORT=5432
ENV POSTGRES_USER=backstage
ENV POSTGRES_PASSWORD=backstage
ENV POSTGRES_DB=backstage_plugin_app

# Define the entrypoint to run the backend
ENTRYPOINT ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
```

---

### **Next Steps**
1. **Modify `app-config.production.yaml` to use the environment variables:**
```yaml
backend:
  database:
    client: pg
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
      database: ${POSTGRES_DB}
```

2. **Run PostgreSQL and Backstage using Docker Compose** (`docker-compose.yml`):
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: backstage-db
    restart: always
    environment:
      POSTGRES_USER: backstage
      POSTGRES_PASSWORD: backstage
      POSTGRES_DB: backstage_plugin_app
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backstage:
    build: .
    container_name: backstage-app
    restart: always
    depends_on:
      - postgres
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_PORT: 5432
      POSTGRES_USER: backstage
      POSTGRES_PASSWORD: backstage
      POSTGRES_DB: backstage_plugin_app
    ports:
      - "7007:7007"

volumes:
  postgres_data:
```

3. **Start the services**:
```bash
docker-compose up --build
```

---

### **Key Fixes in the Dockerfile**
✅ **Added PostgreSQL environment variables**  
✅ **Ensured database connection is configurable via `app-config.production.yaml`**  
✅ **Uses `node` user for security**  
✅ **Ensures proper installation of dependencies**  

Now, Backstage should start successfully inside Docker and connect to PostgreSQL. 🚀 Let me know if you need more tweaks!

# Using github to push to google cloud run