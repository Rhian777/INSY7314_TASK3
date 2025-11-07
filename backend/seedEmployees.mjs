import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Employee } from "./models/Employee.mjs";

dotenv.config();

async function seedEmployees() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const employees = [
      {
        fullName: "John Doe",
        employeeId: "EMP001",
        department: "Finance",
        password: "StrongPass123!"
      },
      {
        fullName: "Sarah Smith",
        employeeId: "EMP002",
        department: "Compliance",
        password: "StrongPass123!"
      },
      {
        fullName: "Alice Johnson",
        employeeId: "EMP003",
        department: "Operations",
        password: "StrongPass123!"
      }
    ];

    for (const emp of employees) {
      // Check if employee already exists
      const exists = await Employee.findOne({ employeeId: emp.employeeId });
      if (exists) {
        console.log(`⚠️ Employee ${emp.employeeId} already exists, skipping...`);
        continue;
      }

      const hashed = await bcrypt.hash(emp.password, 12);
      const newEmp = new Employee({
        fullName: emp.fullName,
        employeeId: emp.employeeId,
        department: emp.department,
        passwordHash: hashed
      });

      await newEmp.save();
      console.log(`✅ Employee ${emp.employeeId} created`);
    }

    console.log("🎉 Employee seeding completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seedEmployees();
