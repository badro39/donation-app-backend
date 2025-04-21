import Donation from "../models/donation.js";

export const addDonation = async (req, res, next) => {
  const { name, email, amount, currency, donateWith, method } = req.body;
  
  try {
    const donation = await Donation.create({
      name,
      email,
      amount,
      donateWith,
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
