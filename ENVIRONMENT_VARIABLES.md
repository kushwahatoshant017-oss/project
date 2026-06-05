# Environment Variables

## Backend (`backend/` or root `.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment (`development`, `production`, `test`) |
| `PORT` | No | `4000` | Server port |
| `HOST` | No | `localhost` | Server host (use `0.0.0.0` for production) |
| `DATABASE_URL` | **Yes** | - | PostgreSQL connection string |
| `DATABASE_HOST` | No | `localhost` | Database host |
| `DATABASE_PORT` | No | `5432` | Database port |
| `DATABASE_NAME` | No | `weathersphere` | Database name |
| `DATABASE_USER` | No | `weathersphere` | Database user |
| `DATABASE_PASSWORD` | No | `weathersphere123` | Database password |
| `REDIS_URL` | No | `redis://localhost:6379` | Redis connection string |
| `REDIS_HOST` | No | `localhost` | Redis host |
| `REDIS_PORT` | No | `6379` | Redis port |
| `REDIS_PASSWORD` | No | - | Redis password |
| `JWT_SECRET` | **Yes** | - | JWT signing secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | **Yes** | - | JWT refresh secret (min 32 chars) |
| `JWT_EXPIRES_IN` | No | `15m` | Access token expiry |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token expiry |
| `JWT_ISSUER` | No | `WeatherSphere` | JWT issuer |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Bcrypt salt rounds |
| `GOOGLE_CLIENT_ID` | No | - | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | - | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | No | - | Google OAuth callback URL |
| `SMTP_HOST` | No | `smtp.gmail.com` | SMTP server host |
| `SMTP_PORT` | No | `587` | SMTP server port |
| `SMTP_USER` | No | - | SMTP username |
| `SMTP_PASS` | No | - | SMTP password |
| `EMAIL_FROM` | No | `noreply@weathersphere.com` | From email address |
| `OPENWEATHERMAP_API_KEY` | No | - | OpenWeatherMap API key |
| `WEATHERAPI_KEY` | No | - | WeatherAPI.com key |
| `OPEN_METEO_BASE_URL` | No | `https://api.open-meteo.com/v1` | Open-Meteo base URL |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window (ms) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per window |
| `CORS_ORIGIN` | No | `http://localhost:3000` | Comma-separated allowed origins |
| `LOG_LEVEL` | No | `debug` | Log level (error, warn, info, http, debug) |
| `LOG_FILE_PATH` | No | `logs/app.log` | Log file path |
| `SWAGGER_ENABLED` | No | `true` | Enable Swagger UI |
| `SWAGGER_PATH` | No | `/api/docs` | Swagger UI path |
| `ENCRYPTION_KEY` | No | - | Encryption key (32 chars) |

## Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | **Yes** | `http://localhost:4000/api` | Backend API base URL |
| `NEXT_PUBLIC_APP_NAME` | No | `WeatherSphere` | Application name |
| `NEXT_PUBLIC_DEFAULT_LANG` | No | `en` | Default language |
| `NEXT_PUBLIC_WEATHER_API_KEY` | No | - | Weather API key (client-side) |

## Render (Dashboard)

Variables marked `sync: false` in `render.yaml` must be set manually in the Render dashboard:
- `OPENWEATHERMAP_API_KEY`
- `WEATHERAPI_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

## Vercel (Dashboard)

Set these in Vercel project settings:
- `NEXT_PUBLIC_API_URL` -> `https://weathersphere-api.onrender.com/api`
