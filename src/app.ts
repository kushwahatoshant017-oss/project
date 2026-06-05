import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import config from '@config/index';
import { swaggerSpec } from '@docs/swagger';
import routes from '@routes/index';
import { errorHandler, notFoundHandler } from '@middleware/errorHandler';
import { globalRateLimiter } from '@middleware/rateLimiter';
import logger from '@utils/logger';

const app: Express = express();

app.use(helmet({
  contentSecurityPolicy: config.nodeEnv === 'production' ? undefined : false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: config.cors.origin.split(',').map(o => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.nodeEnv !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (message: string) => logger.http(message.trim()) },
    skip: (_req, res) => config.nodeEnv === 'production' && res.statusCode < 400,
  }));
}

app.use(globalRateLimiter);

if (config.swagger.enabled) {
  app.use(config.swagger.path, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'WeatherSphere API Documentation',
  }));
  logger.info(`Swagger docs available at ${config.swagger.path}`);
}

app.get('/health', async (_req, res) => {
  const healthCheck = {
    success: true,
    message: 'WeatherSphere API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    memoryUsage: process.memoryUsage().heapUsed,
  };
  res.status(200).json(healthCheck);
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
