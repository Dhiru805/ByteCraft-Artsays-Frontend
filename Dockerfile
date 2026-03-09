# Pre-built locally — build/ folder is committed to the repo
# No npm install or build step needed on the server

FROM nginx:alpine

# Copy pre-built React app
COPY build /usr/share/nginx/html

# Replace main nginx config (resolver must be at http level in nginx 1.29+)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
