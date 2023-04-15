import { Server } from 'socket.io';
import app from './app';
import { appEnvs } from './config';

const server = app.listen(appEnvs.port, () => {
  console.log(`Auth service up on http://localhost:${appEnvs.port}`);
});

const socketIo = new Server(server, {
  cors: {
    origin: '*',
  },
});

socketIo.on('connection', socket => {
  const token = socket.handshake.auth.token;
  console.log('Socket Auth Token: ', token);
  try {
    // verify token and get user info from jwt token
  } catch (error) {
    socket.disconnect();
  }

  socketIo.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('message_from_client', data => {
    console.log('Message from client: ', data);
  });

  setTimeout(() => {
    socket.emit('message_from_server', { message: `Hello from server ${Math.random()}` });
  }, 5000);
});
