import Stripe from 'stripe';
import Donation from '../models/donation.js';
import mongoose from 'mongoose';

export const createCheckoutSession = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { items, donationId } = req.sanitizedBody || req.body;

  if (!mongoose.Types.ObjectId.isValid(donationId)) {
    return res.status(400).json({ message: 'Invalid Donation ID format' });
  }
  const donation = await Donation.findOne({_id: donationId}).lean();
  if (!donation) {
    return res.status(404).json({ message: 'Invalid Donation ID' });
  }
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map(({ amount, currency }) => ({
        price_data: {
          currency,
          unit_amount: amount, // amount in cents
          product_data: {
            name: 'donation',
          },
        },
        quantity: 1,
      })),
      metadata: {
        donationId,
      },
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/`,
    });

    return res.status(201).json({ sessionId: session.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
