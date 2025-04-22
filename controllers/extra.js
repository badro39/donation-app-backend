export const ChargilyPay = async (req, res, next) => {
  const { amount, currency, donationId } = req.body;
  const url = process.env.CHARGILY_CHECKOUT_URL;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY}`,
  };
  const payload = {
    amount,
    currency,
    success_url: `${process.env.FRONTEND_URL}/`,
    failure_url: `${process.env.FRONTEND_URL}/`,
    webhook_endpoint: `${
      process.env.NODE_ENV === 'prod'
        ? process.env.FRONTEND_URL
        : process.env.WEBHOOK_ENDPOINT
    }/webhook/chargily`,
    metadata: {
      donationId,
      currency: currency,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok)
      return res
        .status(response.status)
        .json({ message: data.message || 'failed to create checkout session' });

    const checkoutUrl = data.checkout_url;
    return res.status(200).json({ checkoutUrl });
  } catch (err) {
    next(err);
  }
};

export const StripePay = async (req, res) => {
  const { amount, currency, donationId } = req.body;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/stripe-checkout-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{ amount: amount * 100, currency }],
          donationId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok)
      return res
        .status(response.status)
        .json({ message: data.message || 'failed to create checkout session' });

    return res.status(200).json({ sessionId: data.sessionId });
  } catch (err) {
    console.error(err);
  }
};
