import mongoose from "mongoose";

/**
 * Global cache for Vercel serverless functions
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error("❌ Please define the MONGO_URI environment variable.");
  }

  try {
    // Already connected
    if (cached.conn) {
      return cached.conn;
    }

    // Create connection promise once
    if (!cached.promise) {
      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
      };

      cached.promise = mongoose.connect(MONGO_URI, options);
    }

    cached.conn = await cached.promise;

    console.log(
      `✅ MongoDB Connected: ${cached.conn.connection.host}`
    );

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    
    console.error("\n========== FULL MONGODB ERROR ==========");
    console.error(error);
    console.error("\nName:", error?.name);
    console.error("Code:", error?.code);
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);
    console.error("Cause:", error?.cause);
    console.error("========================================\n");

    throw error;
  }
};

export default connectDB;