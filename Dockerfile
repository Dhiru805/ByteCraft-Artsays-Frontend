# Use Nginx image directly
FROM nginx:alpine

# Copy your manually built React app to Nginx html folder
COPY build /usr/share/nginx/html

# Optional: custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
