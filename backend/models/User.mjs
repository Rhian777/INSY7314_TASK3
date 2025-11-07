import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true },
  accountNumber: { type: String, required: true },
  password: { type: String, required: true }
});

export const User = mongoose.model("User", userSchema);
