// backend/routes/user.mjs
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import mongoose from "mongoose";
import { checkAuth } from "../middleware/checkAuth.mjs";
import { Payment } from "../models/Payment.mjs";

const router = express.Router();

// Simple User model
const userSchema = new mongoose.Schema({
  fullName: String,
  idNumber: String,
  accountNumber: String,
  passwordHash: String
});
const User = mongoose.model("User", userSchema);

// Validation
const registerSchema = Joi.object({
  fullName: Joi.string().pattern(/^[A-Za-z\s]+$/).required(),
  idNumber: Joi.string().pattern(/^[0-9]{13}$/).required(),
  accountNumber: Joi.string().pattern(/^[0-9]{10,12}$/).required(),
  password: Joi.string().min(8).required()
});

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = new User({ ...req.body, passwordHash: hashedPassword });
    await user.save();

    res.json({ message: "User Registered Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { accountNumber, password } = req.body;
    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: "customer" }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ---------------- CUSTOMER PAYMENTS ----------------
router.get("/payments", checkAuth("customer"), async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
