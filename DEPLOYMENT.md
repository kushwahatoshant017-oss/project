# WeatherSphere - Deployment Guide

## Architecture

```
Frontend (Next.js on Vercel)  ──── API Calls ────►  Backend (Express on Render)
                                                         │
                                                    ┌───┴───┐
                                                 PostgreSQL  Redis
                                                 (Render)   (Render)
```

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Render account
- Vercel account
- GitHub repository

---

## Option 1: Render + Vercel (Recommended)

### Backend - Render

1. Fork/clone this repo to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com)
3. Click **New +** > **Blueprint**
4. Connect your GitHub repo
5. Render auto-detects `render.yaml` and creates:
   - Web Service (`weathersphere-api`)
   - PostgreSQL database (`weathersphere-db`)
   - Redis instance (`weathersphere-redis`)
6. After deployment, set sensitive env vars manually:
   - `OPENWEATHERMAP_API_KEY`
   - `WEATHERAPI_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
7. Copy the service URL: `https://weathersphere-api.onrender.com`

### Frontend - Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** > **Project**
3. Import your GitHub repo
4. Set **Root Directory** to `frontend`
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://weathersphere-api.onrender.com/api`
6. Click **Deploy**
7. Copy the deployment URL: `https://weathersphere.vercel.app`

### Connect Frontend to Backend

1. In Render dashboard, set `CORS_ORIGIN` to `https://weathersphere.vercel.app`
2. In Render, set `GOOGLE_CALLBACK_URL` to `https://weathersphere-api.onrender.com/api/auth/google/callback`

---

## Option 2: Docker Compose (Self-Hosted)

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/weathersphere.git
cd weathersphere

# 2. Set environment variables
cp .env.production .env
# Edit .env with your values

# 3. Start all services
docker-compose up -d

# 4. Run database migrations
docker-compose exec app npx prisma migrate deploy

# 5. (Optional) Seed the database
docker-compose exec app npx ts-node -r tsconfig-paths/register prisma/seed.ts

# 6. Verify health
curl http://localhost:4000/health
```

---

## Option 3: Manual Deployment

### Backend

```bash
# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Build TypeScript
npm run build

# Run migrations
npx prisma migrate deploy

# Start server
NODE_ENV=production node dist/server.js
```

### Frontend

```bash
cd frontend

# Install dependencies
npm ci

# Build
npm run build

# Start
npm start
```

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs on every push to `main`:

1. **Quality** - Lint & TypeScript check (backend + frontend)
2. **Test** - Unit + integration tests with PostgreSQL + Redis
3. **Build** - Build backend + frontend
4. **Validate Docker** - Build Docker image
5. **Deploy to Render** - Trigger Render deploy hook
6. **Deploy to Vercel** - Deploy frontend via Vercel action

### Setup GitHub Secrets

| Secret | Description |
|--------|-------------|
| `RENDER_DEPLOY_HOOK_URL` | Render deploy hook URL |
| `RENDER_DEPLOY_HOOK_KEY` | Render deploy hook auth key |
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

---

## Health Check

```
GET /health
```

Response:
```json
{
  "success": true,
  "message": "WeatherSphere API is running",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 12345.67,
  "environment": "production",
  "memoryUsage": 52428800
}
```

---

## Monitoring

- **Logs**: Winston logs to `logs/` directory (JSON format in production)
- **Log Rotation**: Files rotated at 10MB, 10 files retained
- **Health Endpoint**: `GET /health` for load balancer checks

---

## Domain Connection

### Custom Domain for Render (API)

1. In Render dashboard, go to your Web Service
2. **Settings** > **Custom Domain**
3. Add `api.yourdomain.com`
4. Add CNAME record in your DNS provider:
   - Type: `CNAME`
   - Name: `api`
   - Value: `your-service.onrender.com`

### Custom Domain for Vercel (Frontend)

1. In Vercel dashboard, go to your project
2. **Settings** > **Domains**
3. Add `weathersphere.yourdomain.com`
4. Follow Vercel's DNS configuration instructions
