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
