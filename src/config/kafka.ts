import { appEnvs } from '../config';
import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [appEnvs.kafkaUrl],
});

const kafkaProducer = kafka.producer();
kafkaProducer
  .connect()
  .then(() => {
    console.log('Kafka producer connected');
  })
  .catch(err => {
    console.log(err);
  });

export default kafkaProducer;
