import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    await redisClient.set('try', 'Welcome to Express and Typescript with Prisma');
  } catch (error) {
    setTimeout(connectRedis, 5000);
  }
};

void connectRedis().then(r => {
  console.log('Redis Connected!');
});

export default redisClient;
