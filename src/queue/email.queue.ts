import Bull from 'bull';
import { appEnvs } from '../config';
import emailJob from '../jobs/email.job';

const emailQueue = new Bull('email', {
  redis: appEnvs.redisUrl,
  limiter: {
    max: 1000,
    duration: 5000,
  },
});

emailQueue
  .process(emailJob)
  .then(() => {
    console.log('Email queue is ready');
  })
  .catch(err => {
    console.log(err);
  });

const sendNewEmail = (data: any) => {
  emailQueue
    .add(data, {
      attempts: 3,
    })
    .then(() => {
      console.log('Email sent');
    })
    .catch(err => {
      console.log(err);
    });
};

export { sendNewEmail, emailQueue };
