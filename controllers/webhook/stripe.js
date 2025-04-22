import Stripe from 'stripe';
import Donation from '../../models/donation.js';

// Use raw body for webhooks
const stripeWebhook = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }
  
  const session = event.data.object;
  if (!session.metadata?.donationId) {
    return res.status(400).json({ error: 'Donation ID not found in metadata' });
  }
  const donation = await Donation.findOne({ _id: session.metadata.donationId });

  // Handle events
  if (event.type === 'checkout.session.completed') {
    if (session.payment_status === 'paid') {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      ); // to get payment method
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentIntent.payment_method
      ); // to get payment method that already exists in paymentIntent

      // update document
      donation.status = 'paid';
      donation.donatedBy = paymentMethod.card.brand;
    }
  }

  await donation.save();

  res.status(200).send('Received');
};

export default stripeWebhook;
