# Use only NGINX
FROM nginx:alpine

RUN npm install

RUN npm run build

# Copy the pre-built React app from the repo
COPY build /usr/share/nginx/html

# Copy your custom Nginx config (if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
