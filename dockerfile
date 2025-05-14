# Build stage
FROM node:20-alpine as build
WORKDIR /app
# Copy package files and install dependencies
# Add legacy-peer-deps flag for React 19 compatibility
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
# Copy source code
COPY . .
# Build the application
RUN npm run build -- --skipTypeCheck
# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
# Copy built assets from build stage
COPY --from=build /app/dist .
# Copy custom nginx config if you have one
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Set non-root user for security
USER nginx
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]