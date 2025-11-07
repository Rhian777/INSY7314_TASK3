import express from "express";
import Joi from "joi";
import { Payment } from "../models/Payment.mjs";
import { checkAuth } from "../middleware/checkAuth.mjs";

const router = express.Router();

const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().valid("USD", "ZAR", "GBP", "EUR").required(),
  provider: Joi.string().pattern(/^[A-Za-z\s]+$/).required(),
  payeeAccount: Joi.string().pattern(/^[0-9]{10,12}$/).required(),
  swiftCode: Joi.string().pattern(/^[A-Z0-9]{8,11}$/).required()
});

router.post("/create", checkAuth, async (req, res) => {
  try {
    const { error } = paymentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const payment = new Payment({ ...req.body, userId: req.user.id });
    await payment.save();
    res.json({ message: "Payment Created", payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", checkAuth, async (req, res) => {
  const payments = await Payment.find({ userId: req.user.id });
  res.json(payments);
});

export default router;
