# Deployment Guide

Deploy the Clarity **frontend** to a VPS with Docker Compose. The backend (Go API)
and PostgreSQL run in their own stack (the `intake-form-api` repo) and are no
longer brought up here — the two stacks talk over a shared docker network.

## Topology

The frontend calls `/api/*` on the **same domain** it was loaded from. Caddy
terminates HTTPS and proxies those requests to the backend over the shared
`clarity-network`. Because it's same-origin, no CORS configuration is needed.

```
                         ┌─────────────┐
   https://DOMAIN  ──────▶   Caddy     │   (this stack)
                         │  (HTTPS)    │
                         └──────┬──────┘
                  /api/*, /health │  everything else
                ┌────────────────┴────────────────┐
                ▼                                  ▼
        ┌─────────────┐                     ┌─────────────┐
        │   Backend   │  (separate stack)   │  Frontend   │  (this stack)
        │  backend:8080                     │  nginx :80  │
        └──────┬──────┘                     └─────────────┘
               ▼
        ┌─────────────┐
        │  PostgreSQL │  (separate stack)
        └─────────────┘

        ── all containers share the external `clarity-network` ──
```

> **Note:** `VITE_API_URL` is baked into the bundle at *build time* (it's an
> `import.meta.env` value, not a runtime env var). For the same-domain setup,
> leave it **empty** so the app uses same-origin `/api/*`. Only set a full URL
> if the API lives on a different domain — and then the backend must allow that
> origin via CORS.

## Prerequisites

- VPS with Docker and Docker Compose installed
- Domain pointed to your VPS IP address
- Ports 80 and 443 open in firewall
- The backend stack running on the same host (see below)

## Quick Start

1. **Clone the repo on your VPS:**
   ```bash
   git clone https://github.com/tomr1233/booking-intake-form.git
   cd booking-intake-form/deploy
   ```

2. **Create the shared network** (once per host — both stacks attach to it):
   ```bash
   docker network create clarity-network
   ```

3. **Create the environment file:**
   ```bash
   cp .env.example .env
   nano .env   # or vim .env
   ```
   ```
   DOMAIN=clarity.yourdomain.com
   VITE_API_URL=            # leave empty for same-domain
   ```

4. **Make sure the backend stack is up and on the shared network.** Its service
   must be reachable as `backend:8080` on `clarity-network`. In the backend's
   `docker-compose`, that means something like:
   ```yaml
   services:
     backend:                 # service name -> network alias "backend"
       # ...
       networks:
         - clarity-network
   networks:
     clarity-network:
       external: true
   ```

5. **Run the deployment:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

   Or manually:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

## DNS Setup

Point your domain to your VPS IP:
```
A    clarity.yourdomain.com    YOUR_VPS_IP
```

Caddy will automatically obtain SSL certificates from Let's Encrypt.

## Useful Commands

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker compose -f docker-compose.prod.yml logs -f caddy

# Check service status
docker compose -f docker-compose.prod.yml ps

# Stop everything
docker compose -f docker-compose.prod.yml down

# Update and redeploy (rebuilds the frontend bundle)
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## Troubleshooting

### `/api/*` requests return 502
Caddy can't reach the backend. Confirm the backend container is running and
attached to the shared network with the `backend` alias:
```bash
docker network inspect clarity-network        # backend + caddy should both appear
docker compose -f docker-compose.prod.yml logs -f caddy
```

### Frontend still points at localhost
`VITE_API_URL` is baked in at build time. If a stale value is cached, rebuild
without cache:
```bash
docker compose -f docker-compose.prod.yml build --no-cache frontend
docker compose -f docker-compose.prod.yml up -d
```

### SSL certificate issues
Caddy needs ports 80 and 443 open:
```bash
sudo ufw allow 80
sudo ufw allow 443
```
