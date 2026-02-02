# 1️⃣ Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy only package files first to leverage caching
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build TypeScript to /dist
RUN npm run build

# 2️⃣ Production stage
FROM node:20-alpine

WORKDIR /app

# Copy only package files and install prod deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JS from build stage
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 3010

# Start the server
CMD ["node", "dist/index.js"]
