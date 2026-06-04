# WeatherSphere - Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Copy env and configure
cp .env.example .env

# Start dev environment
docker-compose -f docker-compose.dev.yml up -d

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start dev server
npm run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build TypeScript |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npm run test:unit` | Run unit tests |
| `npm run test:integration` | Run integration tests |
| `npm run test:coverage` | Run with coverage |
| `npm run lint` | Lint code |
| `npm run format` | Format code |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run migrations |
| `npm run prisma:seed` | Seed database |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run docker:up` | Start Docker services |

## Architecture

```
src/
├── config/        # Configuration
├── controllers/   # Route handlers
├── database/      # DB clients (Prisma + Redis)
├── docs/          # Swagger docs
├── dto/           # Data transfer objects
├── middleware/     # Express middleware
├── repositories/  # Data access layer
├── routes/        # Express routes
├── services/      # Business logic
├── types/         # TypeScript types
├── utils/         # Utilities
└── server.ts      # Entry point
```

## Environment Variables

See `.env.example` for all required variables.

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | development | Environment |
| PORT | 4000 | Server port |
| DATABASE_URL | - | PostgreSQL connection string |
| REDIS_URL | redis://localhost:6379 | Redis connection string |
| JWT_SECRET | - | JWT signing secret |
| JWT_REFRESH_SECRET | - | JWT refresh secret |

## Default Users (Seed)

| Role | Email | Password |
|------|-------|----------|
| SUPER_ADMIN | superadmin@weathersphere.com | Admin@123456 |
| ADMIN | admin@weathersphere.com | Admin@123456 |
| USER | user@weathersphere.com | User@123456 |

## API Documentation

Swagger UI available at `/api/docs` when `SWAGGER_ENABLED=true`.

## Testing

```bash
npm run test:unit    # Unit tests
npm run test:integration  # Integration tests
npm run test:coverage     # Coverage
```
