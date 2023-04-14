import { type Job } from 'bull';
import nodemailer from 'nodemailer';

const emailJob = async (job: Job) => {
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const info = await transporter.sendMail(job.data);

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  return nodemailer.getTestMessageUrl(info);
};

export default emailJob;
