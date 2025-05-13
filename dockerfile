# Build stage
FROM node:16-alpine as build
WORKDIR /app
# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci
# Copy source code
COPY . .
# Build the application
RUN npm run build
# Production stage
FROM nginx:alpine
# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config if you have one
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Set non-root user for security
USER nginx
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]