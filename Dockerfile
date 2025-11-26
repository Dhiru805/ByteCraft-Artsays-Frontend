# ---------- Stage 1: Build React App ----------
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

RUN npm install

# Copy the rest of the project files
COPY . .

# Build the production-ready React app
ENV NODE_OPTIONS="--max-old-space-size=6096"
RUN npm run build


# ---------- Stage 2: Serve App using NGINX ----------
FROM nginx:alpine

# Copy build output to NGINX html directory
COPY --from=build /app/build /usr/share/nginx/html

# Optional: custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
