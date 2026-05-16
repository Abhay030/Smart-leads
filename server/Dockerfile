# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for TypeScript)
RUN npm ci

# Copy project files
COPY . .

# Build the TypeScript code
RUN npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built dist folder from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "dist/app.js"]
