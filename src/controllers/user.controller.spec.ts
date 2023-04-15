import app from '../app';
import request from 'supertest';

describe('GET /users', () => {
  it('should return 200 OK', async () => {
    const response: any = await request(app).get('/api/v1/users').set('Accept', 'application/json');
    expect(response.status).toEqual(200);
  });

  it('should return an array of users', async () => {
    const response: any = await request(app).get('/api/v1/users').set('Accept', 'application/json');

    expect(response.status).toEqual(200);
  });
});

describe('POST /login', () => {
  it('should return 200 OK', async () => {
    const response: any = await request(app)
      .post('/api/v1/users/login')
      .send({ email: 'test@gmail.com', password: 'test' })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
  });
});
