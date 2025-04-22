//libs
import express from 'express';

// express-validator
import { check } from 'express-validator';

// middleware
import errorValidation from '../middleware/errorValidation.js';

// controllers
import { addDonation } from '../controllers/donation.js';
import { createCheckoutSession } from '../controllers/stripe.js';
const router = express.Router();

router.post(
  '/addDonation',
  [
    check('name', 'Invalid name').notEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('currency', 'Invalid Currency!').notEmpty(),
    check('method', 'Invalid Method!').notEmpty().isIn(["Stripe", "Chargily"]),
    check('amount', `Amount must be greater than 0`)
      .notEmpty()
      .isInt({ gt: 0 })
      .custom((value, { req, res }) => {
        const { method } = req.body;
        if (method == 'chargily' && value < 75)
          return res.status(400).json({ message: 'min amount is 75' });

        if (method == 'stripe' && value < 1)
          return res.status(400).json({ message: 'min amount is 1' });

        return true;
      }),
    errorValidation,
  ],
  addDonation
);

router.post('/stripe-checkout-session', createCheckoutSession);

export default router;
