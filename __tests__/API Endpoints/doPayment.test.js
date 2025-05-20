import request from 'supertest';
import app from '../../app.js';

describe('pay with Chargily / Stripe', () => {
  const payload = {
    amount: 100,
    donationId: "68256ab51913ef1b3d4bbe7f",
  };
  it('POST /extra/chargily', async () => {
    payload.currency = 'dzd';
    const res = await request(app).post('/extra/chargily').send(payload);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('checkoutUrl');
  });
  it('POST /extra/stripe', async () => {
    payload.currency = 'eur';
    const res = await request(app).post('/extra/stripe').send(payload);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('sessionId');
  });
});
