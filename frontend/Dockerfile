FROM node:22.12-slim AS builder

WORKDIR /app

# Copy full monorepo
COPY . .

# Install deps (monorepo root)
RUN npm install

# Build frontend using Nx
RUN npx nx build frontend

FROM nginx:stable-alpine
COPY ./frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
