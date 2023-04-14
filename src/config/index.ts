import dotenv from 'dotenv';

dotenv.config();

export const appEnvs = {
  port: process.env.PORT ?? 3001,
  dbUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? 'JWT_SECRET',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  redisHost: process.env.REDIS_HOST ?? 'localhost',
  redisPort: process.env.REDIS_PORT ?? 6379,
};
