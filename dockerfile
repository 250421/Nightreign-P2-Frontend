# Build stage
FROM node:20-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json crypto-polyfill.cjs ./
RUN npm ci --legacy-peer-deps

# Copy source code and build
COPY . .

RUN NODE_ENV=production NODE_OPTIONS="--experimental-global-webcrypto --require ./crypto-polyfill.cjs" npm run build

# Production stage with built-in Nginx config
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Clean nginx config
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
