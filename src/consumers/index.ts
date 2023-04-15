import { kafka } from '../config/kafka';

const consumer = kafka.consumer({ groupId: 'register-user-topic-test-group' });
consumer
  .connect()
  .then(() => {
    console.log('Kafka consumer connected');
  })
  .catch(err => {
    console.log(err);
  });

consumer
  .subscribe({ topic: 'register-user-topic', fromBeginning: true })
  .then(() => {
    console.log('Subscribed to topic');
  })
  .catch(err => {
    console.log(err);
  });

consumer
  .run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value?.toString(),
      });
    },
  })
  .then(() => {
    console.log('Consumer running');
  })
  .catch(err => {
    console.log(err);
  });
