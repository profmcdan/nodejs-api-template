import express, { type Application, type Response, type Request, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import validateEnv from './utils/validateEnvs';
import redisClient from './utils/connectRedis';
import { userRouter } from './routes';
import { emailQueue } from './queue/email.queue';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

validateEnv();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(emailQueue)],
  serverAdapter,
});

const app: Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/admin/queues', serverAdapter.getRouter());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerOptions: { url: '/swagger.json' } }));

app.use('/api/v1/users', userRouter);

app.get('/api/healthcheck', async (req: Request, res: Response) => {
  const message = await redisClient.get('try');
  res.status(200).json({ status: 'success', message });
});

app.get('/', async (req, res) => {
  res.status(200).json({ message: 'Service up!!' });
});

app.all('*', (req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
  });
});

// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   if (err.type === 'auth') {
//     res.status(401).send({ success: false, detail: 'Unauthorized' });
//   } else if (err.type === 'input') {
//     res.status(400).send({ success: false, error: 'input errors' });
//   } else {
//     res.status(500).send({ success: false, error: err.toString() });
//   }
// });

export default app;
