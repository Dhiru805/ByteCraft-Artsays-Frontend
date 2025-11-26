# Stage 1: Build React app
FROM node:22 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build the app
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build output to Nginx folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for HTTP
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
