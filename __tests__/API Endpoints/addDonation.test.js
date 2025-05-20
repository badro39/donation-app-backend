import request from 'supertest';
import app from '../../app.js';

describe('POST /addDonation', () => {
  it('new donation created', async () => {
    const data = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      amount: 10,
      currency: 'usd',
      method: 'Stripe',
    };
    const res = await request(app).post('/addDonation').send(data);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('donationId');
  });
});
