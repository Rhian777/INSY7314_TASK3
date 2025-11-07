import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.mjs";
import paymentRoutes from "./routes/payment.mjs";
import employeeRoutes from "./routes/employeeRoute.mjs";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/employee", employeeRoutes);

app.get("/", (req, res) => res.json({ status: "Secure Payment API running" }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
