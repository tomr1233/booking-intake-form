# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the source. NOTE: .dockerignore excludes .env files on purpose so the
# dev VITE_API_URL (localhost) never leaks into the production bundle.
COPY . .

# VITE_API_URL is baked into the bundle at build time (it's an import.meta.env
# value, not a runtime var). Leave empty for same-domain deploys: the app then
# calls /api/* on the same origin and Caddy proxies it to the backend. Set to a
# full URL only if the API is on a different domain, e.g. https://api.example.com
ARG VITE_API_URL=""
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
