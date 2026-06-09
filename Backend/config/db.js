import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "❌ Please define the MONGO_URI environment variable."
  );
}

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

    console.error(
      "❌ MongoDB Connection Failed:",
      error.message
    );

    throw error;
  }
};

export default connectDB;