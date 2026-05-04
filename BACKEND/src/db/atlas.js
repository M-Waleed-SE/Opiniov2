import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import dns from 'dns';
import mongoose from "mongoose";

// Use reliable public DNS for MongoDB SRV resolution on Windows if local DNS refuses SRV queries.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;