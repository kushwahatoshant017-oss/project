import app from './app';
import config, { validateRequiredConfig } from '@config/index';
import logger from '@utils/logger';
import { connectDatabase, disconnectDatabase } from '@database/client';
import redisClient from '@database/redis';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

async function bootstrap(): Promise<void> {
  try {
    if (config.nodeEnv === 'production') {
      validateRequiredConfig();
      logger.info('Production configuration validated');
    }

    await connectDatabase();

    const httpServer = createServer(app);

    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: config.cors.origin,
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);
      socket.on('subscribe:weather', (data: { lat: number; lon: number }) => {
        const room = `weather:${data.lat}:${data.lon}`;
        socket.join(room);
      });
      socket.on('unsubscribe:weather', (data: { lat: number; lon: number }) => {
        const room = `weather:${data.lat}:${data.lon}`;
        socket.leave(room);
      });
      socket.on('subscribe:alerts', (userId: string) => {
        socket.join(`alerts:${userId}`);
      });
      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });

    app.set('io', io);

    httpServer.listen(config.port, config.host, () => {
      logger.info(`WeatherSphere API running on http://${config.host}:${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`Swagger docs: http://${config.host}:${config.port}${config.swagger.path}`);
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      io.close();
      httpServer.close(async () => {
        await redisClient.disconnect();
        await disconnectDatabase();
        logger.info('Shutdown complete');
        process.exit(0);
      });
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

bootstrap();
