import dotenv from 'dotenv';

dotenv.config();

export const appEnvs = {
  port: process.env.PORT ?? 3001,
  dbUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
};
