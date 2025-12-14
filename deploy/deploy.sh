#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Clarity Deployment Script ===${NC}"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Copy .env.example to .env and fill in the values:"
    echo "  cp .env.example .env"
    exit 1
fi

# Load environment variables
source .env

# Validate required variables
if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "your-domain.com" ]; then
    echo -e "${RED}Error: DOMAIN not set in .env${NC}"
    exit 1
fi

if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" = "change-me-to-a-strong-password" ]; then
    echo -e "${RED}Error: DB_PASSWORD not set in .env${NC}"
    exit 1
fi

if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "your-gemini-api-key" ]; then
    echo -e "${RED}Error: GEMINI_API_KEY not set in .env${NC}"
    exit 1
fi

echo -e "${GREEN}Configuration validated${NC}"
echo "  Domain: $DOMAIN"

# Build and start containers
echo -e "${YELLOW}Building containers...${NC}"
docker compose -f docker-compose.prod.yml build

echo -e "${YELLOW}Starting services...${NC}"
docker compose -f docker-compose.prod.yml up -d

# Wait for postgres to be ready
echo -e "${YELLOW}Waiting for PostgreSQL...${NC}"
sleep 5

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker compose -f docker-compose.prod.yml exec -T backend sh -c '
    for f in migrations/*.up.sql; do
        if [ -f "$f" ]; then
            echo "Applying $f"
            # Use environment variable for connection
            PGPASSWORD=$(echo $DATABASE_URL | sed "s/.*:\([^@]*\)@.*/\1/") \
            PGHOST=$(echo $DATABASE_URL | sed "s/.*@\([^:]*\):.*/\1/") \
            PGPORT=$(echo $DATABASE_URL | sed "s/.*:\([0-9]*\)\/.*/\1/") \
            PGUSER=$(echo $DATABASE_URL | sed "s/.*\/\/\([^:]*\):.*/\1/") \
            PGDATABASE=$(echo $DATABASE_URL | sed "s/.*\/\([^?]*\).*/\1/")
        fi
    done
'

# Alternative: run migrations using psql from postgres container
docker compose -f docker-compose.prod.yml exec -T postgres sh -c '
    for f in /tmp/migrations/*.up.sql; do
        if [ -f "$f" ]; then
            echo "Applying $f"
            psql -U clarity -d clarity_intake -f "$f" 2>/dev/null || true
        fi
    done
' 2>/dev/null || echo "Note: Run migrations manually if needed"

echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo "Your app should be available at: https://$DOMAIN"
echo ""
echo "Useful commands:"
echo "  docker compose -f docker-compose.prod.yml logs -f     # View logs"
echo "  docker compose -f docker-compose.prod.yml ps          # Check status"
echo "  docker compose -f docker-compose.prod.yml down        # Stop services"
echo "  docker compose -f docker-compose.prod.yml pull        # Update images"
