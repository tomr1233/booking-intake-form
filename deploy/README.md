# Deployment Guide

Deploy Clarity to a VPS with Docker Compose.

## Prerequisites

- VPS with Docker and Docker Compose installed
- Domain pointed to your VPS IP address
- Ports 80 and 443 open in firewall

## Quick Start

1. **Clone both repos on your VPS:**
   ```bash
   git clone https://github.com/tomr1233/booking-intake-form.git
   git clone https://github.com/tomr1233/intake-form-api.git
   ```

2. **Navigate to deploy folder:**
   ```bash
   cd booking-intake-form/deploy
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   nano .env  # or vim .env
   ```

4. **Fill in the environment variables:**
   ```
   DOMAIN=clarity.yourdomain.com
   DB_PASSWORD=your-secure-password-here
   GEMINI_API_KEY=your-gemini-api-key
   FRONTEND_URL=https://clarity.yourdomain.com
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

6. **Run database migrations:**
   ```bash
   # Copy migrations into the container and run them
   docker cp ../../intake-form-api/migrations clarity-postgres:/tmp/
   docker exec -it clarity-postgres sh -c 'for f in /tmp/migrations/*.up.sql; do psql -U clarity -d clarity_intake -f "$f"; done'
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
docker compose -f docker-compose.prod.yml logs -f backend

# Check service status
docker compose -f docker-compose.prod.yml ps

# Restart a service
docker compose -f docker-compose.prod.yml restart backend

# Stop everything
docker compose -f docker-compose.prod.yml down

# Update and redeploy
git pull
docker compose -f docker-compose.prod.yml up -d --build

# Access postgres CLI
docker exec -it clarity-postgres psql -U clarity -d clarity_intake
```

## Troubleshooting

### SSL certificate issues
Caddy needs ports 80 and 443 open. Check:
```bash
sudo ufw allow 80
sudo ufw allow 443
```

### Database connection errors
Check postgres is healthy:
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs postgres
```

### Backend not starting
Check environment variables and logs:
```bash
docker compose -f docker-compose.prod.yml logs backend
```

## Architecture

```
                    ┌─────────────┐
                    │   Caddy     │
                    │  (HTTPS)    │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               │
    ┌─────────────┐  ┌─────────────┐       │
    │  Frontend   │  │   Backend   │       │
    │   (nginx)   │  │    (Go)     │       │
    │    :80      │  │   :8080     │       │
    └─────────────┘  └──────┬──────┘       │
                           │               │
                           ▼               │
                    ┌─────────────┐        │
                    │  PostgreSQL │        │
                    │    :5432    │        │
                    └─────────────┘        │
```

- **Caddy**: Reverse proxy with automatic HTTPS
- **Frontend**: React app served by nginx
- **Backend**: Go API
- **PostgreSQL**: Database