import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@furnisure.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "Admin";

    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log("Admin user already exists:", adminEmail);
      existingAdmin.isAdmin = true;
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("Admin privileges updated");
    } else {
      const admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        isAdmin: true,
      });
      console.log("Admin user created:", admin.email);
    }

    await mongoose.connection.close();
    console.log("Done!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
