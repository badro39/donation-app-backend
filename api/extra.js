import { Router } from "express"
import {ChargilyPay, StripePay} from "../controllers/extra.js"

const router = Router()

router.post("/chargily", ChargilyPay)
router.post("/stripe", StripePay)

export default router