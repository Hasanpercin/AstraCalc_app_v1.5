# AstroCalc Development Environment
# Multi-stage Docker setup for React Native + Expo + Supabase

FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    git \
    openssh \
    python3 \
    make \
    g++ \
    && npm install -g expo-cli@latest

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .npmrc* ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development

# Install dev dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Expose Expo dev server port
EXPOSE 19000 19001 19002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:19000 || exit 1

# Start development server
CMD ["npm", "run", "dev"]

# Production build stage
FROM base AS builder

# Copy source code
COPY . .

# Build for production
RUN npm run build:all

# Production stage
FROM nginx:alpine AS production

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
