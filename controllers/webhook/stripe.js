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
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  
  // Handle events
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    if(session.payment_status === "paid"){
      if (!session.metadata?.donationId) {
        return res.status(400).json({ error: 'Donation ID not found in metadata' });
      }
      const donation = await Donation.findOne({_id: session.metadata.donationId});
      donation.status = 'paid';
      await donation.save();
    }
    
  }

  res.status(200).send('Received');
};

export default stripeWebhook;
