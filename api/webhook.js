// libs
import express from 'express';
// controllers
import chargilyWebhook from '../controllers/webhook/chargily.js';
import stripeWebhook from '../controllers/webhook/stripe.js';

// constants
const router = express.Router();

router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);
router.post('/chargily', express.raw({ type: 'application/json' }), chargilyWebhook);

export default router;
