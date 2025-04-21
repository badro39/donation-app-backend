import Stripe from 'stripe';

export const createCheckoutSession = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const {items, donationId} = req.body
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map(({ amount, currency }) => ({
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: amount, // amount in cents
          product_data: {
            name: 'donation',
          },
        },
        quantity: 1,
      })),
      metadata: {
        donationId: donationId,
      },
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
