# The image the k3s cluster runs, built by .github/workflows/build.yml. Base images pinned by digest.
# node-1 uses deploy/Dockerfile and deploy/docker-compose.prod.yml until the cutover.
FROM node:22.23.4-alpine3.24@sha256:0e1754758c2df4cfa3e68d59e2e1b7374bb7fd9ea6328eaaacf15cc934af8202 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# .dockerignore keeps every .env out, so a local VITE_API_URL can't leak into the bundle.
COPY . .

# Baked into the bundle at build time. Empty on purpose: the app calls /api/* on whichever
# host served it, so one image works on the temporary host and the real one.
ARG VITE_API_URL=""
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# nginx as uid 101, listening on 8080, with temp files under /tmp (Pod Security "restricted").
FROM nginxinc/nginx-unprivileged:1.31.7-alpine3.24@sha256:b5047b9b76845eac124358373c6852377c52e4b05834a47647e955dd91cb8f1e
COPY --from=build /app/dist /usr/share/nginx/html
COPY deploy/nginx.k8s.conf /etc/nginx/conf.d/default.conf
# A bad config fails the build rather than the rollout.
RUN nginx -t
EXPOSE 8080
USER 101
