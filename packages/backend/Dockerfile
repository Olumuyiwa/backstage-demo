# This is for the docker image of the Backstage backend
# This Dockerfile is a multi-stage build that builds the backend and then runs it in a separate container

# Stage 1: Build stage
FROM node:20-bullseye-slim  as build

# Install necessary dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 g++ make build-essential libsqlite3-dev ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install dependencies
# Only install the necessary production dependencies
RUN yarn install --production --frozen-lockfile --network-timeout 300000 && \
    rm -rf "$(yarn cache dir)" && \
    rm -rf /app/tests /app/docs /app/.git

# Copy the entire project into the container
COPY . .

# Stage 2: Runtime stage
FROM node:20-bullseye-slim  as runtime

# Set the working directory in the container
WORKDIR /app

# Copy necessary files from the build stage
COPY --from=build /app /app

# Remove unnecessary files to reduce image size
RUN rm -rf /app/tests /app/docs /app/.git /app/.github

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

# Set the environment variable for the app to listen on port 8080
ENV BACKSTAGE_APP_PORT=8080

# Expose Backstage default port
EXPOSE 8080

# move this to docker-compose
# Set environment variables for Backstage & Database
# ENV BACKSTAGE_APP_PORT=8081
# ENV BACKSTAGE_BASE_URL=http://localhost:${BACKSTAGE_APP_PORT}
# ENV POSTGRES_HOST=backstage-app
# ENV POSTGRES_PORT=5433
# ENV POSTGRES_USER=backstage
# ENV POSTGRES_PASSWORD=backstage
# ENV POSTGRES_DB=postgres

# Define the entrypoint to run the backend
ENTRYPOINT ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]