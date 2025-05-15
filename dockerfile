# Build stage
FROM node:20-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source code and build
COPY . .

RUN NODE_ENV=production npm run build

# Production stage with built-in Nginx config
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Create a simple default Nginx config directly
RUN echo 'server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Build stage
# FROM node:20-alpine AS build
# WORKDIR /app
# # Copy package files and install dependencies
# # Add legacy-peer-deps flag for React 19 compatibility
# COPY package.json package-lock.json ./
# RUN npm ci --legacy-peer-deps
# # Copy source code
# COPY . .
# # Build the application
# RUN npm run build -- --skipTypeCheck
# # Production stage
# FROM nginx:alpine
# WORKDIR /usr/share/nginx/html
# # Copy built assets from build stage
# COPY --from=build /app/dist .
# # Copy custom nginx config if you have one
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# # Set non-root user for security
# USER nginx
# # Expose port
# EXPOSE 80
# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]