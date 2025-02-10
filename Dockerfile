# Use official Node.js image as base
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all project files
COPY . .

# Build the Backstage app
RUN yarn build:backend --config app-config.production.yaml

# Expose the port Backstage runs on
EXPOSE 7007

# Start the app
CMD ["yarn", "start"]
