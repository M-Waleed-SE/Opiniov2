import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import dns from 'dns';
import mongoose from "mongoose";

// Use reliable public DNS for MongoDB SRV resolution on Windows if local DNS refuses SRV queries.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI?.trim();
    if (!mongoUri) {
      throw new Error('MONGO_URI is not set or is empty');
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;