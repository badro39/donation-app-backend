// libs
import crypto from 'crypto';

// models
import Donation from '../../models/donation.js';

const chargilyWebhook = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const signature = req.get('signature');
  const payload = req.body.toString();
  const secret = process.env.CHARGILY_SECRET_KEY;

  if (!secret) {
    return res
      .sendStatus(500)
      .json({ message: 'CHARGILY_WEBHOOK_SECRET is not set' });
  }
  if (!signature) {
    return res
      .sendStatus(400)
      .json({ message: 'No signature found in headers' });
  }

  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  if (signature !== computedSignature) {
    return res.status(403).json({ error: 'Invalid signature' });
  }

  try {
    const { type, data } = JSON.parse(payload);

    const donationId = data?.metadata?.donationId;
    if (!donationId)
      return res
        .status(400)
        .json({ error: 'Donation ID not found in metadata' });

    const donation = await Donation.findOne({ _id: donationId });
    if (type === 'checkout.paid') {
      donation.status = 'paid';
      donation.donatedBy = data.payment_method;
    } else if (type === 'checkout.canceled') {
      donation.status = 'canceled';
    }

    await donation.save();
    return res.status(200).json({ message: 'Payment updated successfully' });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default chargilyWebhook;
