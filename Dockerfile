# Pre-built locally — build/ folder is committed to the repo
# No npm install or build step needed on the server

FROM nginx:alpine

# Copy pre-built React app
COPY build /usr/share/nginx/html

# Replace main nginx config (resolver must be at http level in nginx 1.29+)
COPY nginx.conf /etc/nginx/nginx.conf

# Remove default config so entrypoint scripts don't create a conflicting server block
RUN rm -f /etc/nginx/conf.d/default.conf

# Ensure nginx user can write the pid file
RUN touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

# Validate config at build time so errors are caught early
RUN nginx -t 2>&1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
