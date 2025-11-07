import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String },
  passwordHash: { type: String, required: true }
});

export const Employee = mongoose.model("Employee", employeeSchema);