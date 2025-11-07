// backend/routes/paymentRoutes.js
import express from "express";
import Joi from "joi";
import { Payment } from "../models/Payment.js";
import { requireAuth } from "../middleware/auth.js";
import { encryptField } from "../utils/crypto.js";

const router = express.Router();

/*
Validation rules (whitelisting):
- amount: positive number
- currency: ISO currency code 3 letters
- provider: alphanumeric and spaces (simple)
- payeeAccount: numeric 8-34 (common bank account ranges); adjust if needed
- swiftCode: SWIFT/BIC format: 8 or 11 uppercase letters/digits
*/

const paymentSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required(),
  currency: Joi.string().uppercase().length(3).required(),
  provider: Joi.string().pattern(/^[A-Za-z0-9\s\-]+$/).min(2).max(40).required(),
  payeeAccount: Joi.string().pattern(/^[0-9]{6,34}$/).required(),
  swiftCode: Joi.string().pattern(/^[A-Z0-9]{8}([A-Z0-9]{3})?$/).required()
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { error, value } = paymentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // Encrypt sensitive fields
    const payeeEncrypted = encryptField(value.payeeAccount);
    const swiftEncrypted = encryptField(value.swiftCode);

    const payment = new Payment({
      amount: value.amount,
      currency: value.currency,
      provider: value.provider,
      payeeAccountEncrypted: payeeEncrypted,
      swiftCodeEncrypted: swiftEncrypted,
      status: "Pending",
      createdBy: req.userId
    });

    await payment.save();

    // Very simple audit: in production push to SIEM, write-once storage
    console.info(`[AUDIT] user=${req.userId} action=create_payment id=${payment._id} ip=${req.ip} time=${new Date().toISOString()}`);

    res.status(201).json({ message: "Payment created and pending verification", paymentId: payment._id });
  } catch (err) {
    console.error("Payment creation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
