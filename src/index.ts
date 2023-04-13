import app from './app';
import { appEnvs } from './config';

app.listen(appEnvs.port, () => {
  console.log(`Auth service up on http://localhost:${appEnvs.port}`);
});
