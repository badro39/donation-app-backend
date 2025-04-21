import { Schema, model } from "mongoose";

const donationSchema = new Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true},
    amount: {type: Number, required: true},
    currency: {type: String, lowercase: true, required: true},
    method: {type: String, enum: ["Chargily", "Stripe"], required: true},
    status: {type: String, enum: ["pending", "paid", "canceled"], default: "pending"},
  },
  {
    timestamps: true,
  }
);

const Donation = model("Donation", donationSchema, "donation");
export default Donation;
