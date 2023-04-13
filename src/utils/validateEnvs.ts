import { cleanEnv, str, port } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    REDIS_URL: str(),
    DATABASE_URL: str(),
    JWT_SECRET: str(),
  });
};

export default validateEnv;
