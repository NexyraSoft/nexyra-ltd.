import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { env } from "../config/env";

const createAdmin = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(env.mongoUri);
    console.log("Connected to database successfully!");

    const adminEmail = "admin@nexyrasoft.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: admin123`);

  } catch (error) {
    console.error("Failed to create admin:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
