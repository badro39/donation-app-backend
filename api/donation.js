//libs 
import express from 'express';

// express-validator
import { check } from 'express-validator';

// controllers
import {addDonation} from '../controllers/donation.js';
import {createCheckoutSession} from '../controllers/stripe.js';
const router = express.Router();

router.post('/addDonation', [
    check("currency", "Invalid Currency!").notEmpty(),
    check("method", "Invalid Method!").notEmpty(),
    check("donateWith", "Invalid Payment provider!").notEmpty(),
    check("amount", `Amount must be greater than 0`).notEmpty().isInt({ gt: 0}).custom((value, {req}) =>{
     const {method} = req.body
     if(method == "chargily" && value < 75){
        throw new Error("Amount min value is 75")
     }
     if(method == "stripe" && value < 1){
        throw new Error("Amount min value is 1")
     }
     return true
    }),
], addDonation)

router.post('/stripe-checkout-session', createCheckoutSession);

export default router