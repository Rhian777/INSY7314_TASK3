// backend/routes/employeeRoutes.mjs
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Employee } from "../models/Employee.mjs";
import { Payment } from "../models/Payment.mjs";
import { checkAuth } from "../middleware/checkAuth.mjs";

const router = express.Router();

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    const employee = await Employee.findOne({ employeeId });

    if (!employee) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, employee.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: employee._id, role: "employee" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- GET PENDING TRANSACTIONS ----------------
router.get("/transactions", checkAuth("employee"), async (req, res) => {
  try {
    const payments = await Payment.find({ status: "Pending" });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- VERIFY TRANSACTION ----------------
router.put("/verify/:id", checkAuth("employee"), async (req, res) => {
  try {
    const { id } = req.params;
    const { swiftCode } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: "Transaction not found" });

    const swiftValid = /^[A-Z]{8,11}$/.test(swiftCode);
    if (!swiftValid) return res.status(400).json({ message: "Invalid SWIFT code" });

    payment.swiftCode = swiftCode;
    payment.status = "Verified";
    await payment.save();

    res.json({ message: "Transaction verified", payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- SUBMIT VERIFIED TRANSACTIONS ----------------
router.post("/submit-to-swift", checkAuth("employee"), async (req, res) => {
  try {
    const result = await Payment.updateMany(
      { status: "Verified" },
      { $set: { status: "Sent to SWIFT" } }
    );

    res.json({
      message: "Transactions successfully submitted to SWIFT",
      count: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

