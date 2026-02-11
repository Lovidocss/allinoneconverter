import mongoose from "mongoose";

// Cache the database connection for serverless environments
let cachedConnection: typeof mongoose | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/allinonepdf";
  
  // Return cached connection if available (important for serverless)
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("✅ Using cached MongoDB connection");
    return cachedConnection;
  }
  
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedConnection = conn;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    // In serverless, don't throw - just log and continue
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      console.warn("⚠️ Running without database connection");
      return mongoose;
    }
    throw error;
  }
}

export default connectDB;
