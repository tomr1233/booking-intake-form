# Deployment Guide

Deploy the Clarity **frontend** to the VPS with Docker Compose. The backend
(Go API) runs in its own stack (the `intake-form-api` repo). TLS and routing
for `intake.expressnext.app` are handled by the **Caddy that already runs as a
host process** on the VPS — this stack does not run its own proxy.

## Topology

The frontend calls `/api/*` on the **same domain** it was loaded from. The host
Caddy splits that domain: API traffic goes to the backend, everything else to
the frontend. Both upstreams are bound to host loopback. Same-origin, so no CORS.

```
        https://intake.expressnext.app
                     │
                     ▼
            ┌──────────────────┐
            │   Caddy (HOST)   │   pre-existing, terminates TLS
            └───┬──────────┬───┘
       /api/*   │          │   everything else
       /health  │          │
                ▼          ▼
        127.0.0.1:8080   127.0.0.1:3000
        ┌────────────┐   ┌─────────────┐
        │  Backend   │   │  Frontend   │  (this stack)
        │  (api)     │   │  nginx :80  │
        └────────────┘   └─────────────┘
```

> **Note:** `VITE_API_URL` is baked into the bundle at *build time* (it's an
> `import.meta.env` value, not a runtime env var). For this same-domain setup,
> leave it **empty** so the app uses same-origin `/api/*`. Only set a full URL
> if the API is served from a different domain — and then the backend must allow
> that origin via CORS.

## Prerequisites

- VPS with Docker and Docker Compose installed
- The host Caddy already serving `intake.expressnext.app`
- The backend stack running and published on `127.0.0.1:8080`

## Quick Start

1. **Clone / update the repo on the VPS:**
   ```bash
   git clone https://github.com/tomr1233/booking-intake-form.git
   cd booking-intake-form/deploy
   ```

2. **(Optional) environment file** — only needed if the API lives on a different
   domain. For same-domain, skip it or leave `VITE_API_URL` empty:
   ```bash
   cp .env.example .env
   # VITE_API_URL=            # empty -> same-origin /api/*
   ```

3. **Build and start the frontend:**
   ```bash
   chmod +x deploy.sh && ./deploy.sh
   # or:
   docker compose -f docker-compose.prod.yml up -d --build
   ```
   This serves the frontend on `127.0.0.1:3000`.

4. **Point the host Caddy at it.** In your host Caddy config (e.g.
   `/etc/caddy/Caddyfile`), the `intake.expressnext.app` block should be:
   ```caddy
   intake.expressnext.app {
       handle /api/*  { reverse_proxy 127.0.0.1:8080 }
       handle /health { reverse_proxy 127.0.0.1:8080 }
       handle         { reverse_proxy 127.0.0.1:3000 }
   }
   ```
   Then reload:
   ```bash
   sudo systemctl reload caddy
   ```
   (A copy of this block lives in `Caddyfile` in this repo for reference — it is
   **not** loaded by the docker stack.)

## Verify

```bash
curl -s  http://127.0.0.1:8080/health           # backend reachable locally -> 200
curl -sI http://127.0.0.1:3000                   # frontend container -> 200
curl -sI https://intake.expressnext.app          # through Caddy -> 200, Server: Caddy
curl -s  https://intake.expressnext.app/health   # routed to backend -> 200
```

## Useful Commands

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f

# Check status
docker compose -f docker-compose.prod.yml ps

# Update and redeploy (rebuilds the frontend bundle)
git pull
docker compose -f docker-compose.prod.yml up -d --build

# Stop
docker compose -f docker-compose.prod.yml down
```

## Troubleshooting

### The whole page returns 502
The host Caddy can't reach an upstream. Check both are listening:
```bash
docker compose -f docker-compose.prod.yml ps     # clarity-frontend should be Up
curl -sI http://127.0.0.1:3000                    # frontend
curl -s  http://127.0.0.1:8080/health             # backend
sudo systemctl status caddy --no-pager
```
Also make sure no container is holding ports 80/443 away from the host Caddy
(`docker ps` — there should be no Caddy container from this stack).

### Submissions hit `localhost:8080` / fail
The served bundle is a stale build. `localhost:8080` is the dev-mode fallback in
`services/api.ts`; a production build uses same-origin `/api/*`. Rebuild — a
`restart` is not enough:
```bash
docker compose -f docker-compose.prod.yml build --no-cache frontend
docker compose -f docker-compose.prod.yml up -d
```
Then hard-refresh the browser (Cmd/Ctrl+Shift+R) — nginx serves JS as immutable.

### `/api/*` returns 404 / HTML instead of JSON
The host Caddy is sending `/api/*` to the frontend instead of the backend. Add
the `handle /api/*` block above and reload Caddy.
