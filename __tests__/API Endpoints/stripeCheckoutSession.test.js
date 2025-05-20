import request from 'supertest';
import app from '../../app.js';

describe('POST /extra/stripe – Create Checkout Session', () => {
  it('should create a Stripe checkout session and return sessionId', async () => {
    const payload = {
      donationId: '68256ab51913ef1b3d4bbe7f',
      items: [
        {
          amount: 1000, // $10.00
          currency: 'usd',
        },
      ],
    };

    const res = await request(app)
      .post('/stripe-checkout-session')
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('sessionId');
  });
});
