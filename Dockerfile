# Use only NGINX
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm run build

FROM nginx:alpine

# Copy the pre-built React app from the repo
COPY --from=build /app/build /usr/share/nginx/html

# Copy your custom Nginx config (if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
