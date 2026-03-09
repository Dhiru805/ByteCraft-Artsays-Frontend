# Pre-built locally — build/ folder is committed to the repo
# No npm install or build step needed on the server

FROM nginx:alpine

# Copy pre-built React app
COPY build /usr/share/nginx/html

# Replace main nginx config (resolver must be at http level in nginx 1.29+)
COPY nginx.conf /etc/nginx/nginx.conf

# Validate config at build time so errors are caught early
RUN nginx -t

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
