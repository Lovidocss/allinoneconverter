// Seed script to create admin user
// Run with: npx ts-node src/scripts/seed-admin.ts

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/allinonepdf";

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Define User schema inline to avoid import issues
    const UserSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true, lowercase: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, enum: ["user", "admin"], default: "user" },
      subscription: { type: String, enum: ["free", "pro", "business"], default: "free" },
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    // Admin user details
    const adminEmail = "mdfahadzulfiqar@gmail.com";
    const adminPassword = "admin123"; // Change this in production!
    const adminName = "Fahad Zulfiqar";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log("Admin user already exists. Updating to admin role...");
      existingAdmin.role = "admin";
      existingAdmin.subscription = "pro"; // Give admin pro subscription
      await existingAdmin.save();
      console.log("Admin user updated successfully!");
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      // Create admin user
      const admin = await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: "admin",
        subscription: "pro",
      });

      console.log("Admin user created successfully!");
      console.log("Email:", admin.email);
      console.log("Name:", admin.name);
      console.log("Role:", admin.role);
    }

    console.log("\n⚠️  Default password is 'admin123' - please change it after first login!");
    
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
