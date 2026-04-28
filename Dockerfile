# Base image with shared dependencies
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
# Install all dependencies (including devDeps needed for building/tsx)
RUN npm install

# --- Frontend Build Stage ---
FROM base AS build-frontend
# Accept build-time variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# --- Backend Runtime Stage ---
FROM base AS backend
COPY . .
# The backend uses 'tsx' which is in devDependencies, so we kept them
EXPOSE 5000
CMD ["npm", "run", "server:start"]

# --- Frontend Runtime Stage (Nginx) ---
FROM nginx:stable-alpine AS frontend
COPY --from=build-frontend /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
