#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Clarity Frontend Deployment ===${NC}"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Copy .env.example to .env and fill in the values:"
    echo "  cp .env.example .env"
    exit 1
fi

# Load environment variables (also exported so docker compose can interpolate them)
set -a
source .env
set +a

# Validate required variables
if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "your-domain.com" ]; then
    echo -e "${RED}Error: DOMAIN not set in .env${NC}"
    exit 1
fi

echo -e "${GREEN}Configuration validated${NC}"
echo "  Domain:        $DOMAIN"
echo "  VITE_API_URL:  ${VITE_API_URL:-<same-origin /api/*>}"

# Ensure the shared docker network exists (also used by the backend stack)
if ! docker network inspect clarity-network >/dev/null 2>&1; then
    echo -e "${YELLOW}Creating shared docker network 'clarity-network'...${NC}"
    docker network create clarity-network
fi

# Build and start the frontend stack
echo -e "${YELLOW}Building frontend...${NC}"
docker compose -f docker-compose.prod.yml build

echo -e "${YELLOW}Starting frontend + caddy...${NC}"
docker compose -f docker-compose.prod.yml up -d

echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo "Your app should be available at: https://$DOMAIN"
echo ""
echo -e "${YELLOW}Reminder:${NC} the backend stack must be running and attached to"
echo "the 'clarity-network' network, reachable as 'api:8080', or /api/*"
echo "requests will return 502."
echo ""
echo "Useful commands:"
echo "  docker compose -f docker-compose.prod.yml logs -f     # View logs"
echo "  docker compose -f docker-compose.prod.yml ps          # Check status"
echo "  docker compose -f docker-compose.prod.yml down        # Stop services"
echo "  docker compose -f docker-compose.prod.yml up -d --build  # Rebuild + restart"
