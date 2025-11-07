import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import Joi from "joi";

const router = express.Router();

const registerSchema = Joi.object({
  fullName: Joi.string().pattern(/^[A-Za-z\s]+$/).required(),
  idNumber: Joi.string().pattern(/^[0-9]{13}$/).required(),
  accountNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(12).required()
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      fullName: req.body.fullName,
      idNumber: req.body.idNumber,
      accountNumber: req.body.accountNumber,
      passwordHash: hashed
    });

    await user.save();
    res.status(201).json({ message: "Registration successful." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { accountNumber, password } = req.body;
    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });

    // <-- Return the token in JSON for frontend
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});