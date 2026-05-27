#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Clarity Frontend Deployment ===${NC}"

# VITE_API_URL (a build arg) is read from .env if present. Leave it empty for
# the same-domain setup — the host Caddy routes /api/* to the backend, so the
# app just calls /api/* on its own origin.
if [ -f .env ]; then
    set -a
    source .env
    set +a
    echo "  VITE_API_URL: ${VITE_API_URL:-<empty -> same-origin /api/*>}"
fi

echo -e "${YELLOW}Building and starting the frontend...${NC}"
docker compose -f docker-compose.prod.yml up -d --build

echo -e "${GREEN}=== Frontend deployed ===${NC}"
echo ""
echo "The frontend is now served on 127.0.0.1:3000 (behind your host Caddy)."
echo ""
echo -e "${YELLOW}Make sure your host Caddy config (e.g. /etc/caddy/Caddyfile) has:${NC}"
echo "    intake.expressnext.app {"
echo "        handle /api/*  { reverse_proxy 127.0.0.1:8080 }"
echo "        handle /health { reverse_proxy 127.0.0.1:8080 }"
echo "        handle         { reverse_proxy 127.0.0.1:3000 }"
echo "    }"
echo "  then reload it:  sudo systemctl reload caddy"
echo ""
echo "Useful commands:"
echo "  docker compose -f docker-compose.prod.yml logs -f          # View logs"
echo "  docker compose -f docker-compose.prod.yml ps               # Check status"
echo "  docker compose -f docker-compose.prod.yml up -d --build    # Rebuild + restart"
echo "  docker compose -f docker-compose.prod.yml down             # Stop"
