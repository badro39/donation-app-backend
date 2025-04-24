import Donation from "../models/donation.js";

export const addDonation = async (req, res, next) => {
  const { name, email, amount, currency, method } = req.sanitizedBody;
  
  try {
    const donation = await Donation.create({
      name,
      email,
      amount,
      currency,
      method,
    });

    return res.status(201).json({
      success: true,
      donationId: donation._id,      
    });
  } catch (err) {
    next(err)
  }
};
