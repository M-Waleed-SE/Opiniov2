import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

import connectDB from './db/atlas.js'


import { User } from './models/user.models.js';
import { Blog } from './models/blog.models.js';
import { Admin } from './models/admin.model.js';


connectDB();
import express from 'express'
import cors from 'cors';

const app = express()
const port = process.env.PORT || 5000
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim().toLowerCase()) 
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin.toLowerCase())) {
      return callback(null, true);
    } else {
      console.log('Blocked by CORS. Origin:', origin);
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true
}));

app.use(express.json());


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

import authRoutes from './routes/auth.routes.js';
import blogRoutes from './routes/blog.routes.js';
import adminRoutes from './routes/admin.routes.js';

const seedAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: 'admin@opinio.com' });
    if (!adminExists) {
      const admin = new Admin({
        username: 'masteradmin',
        email: 'admin@opinio.com',
        password: 'adminpassword123'
      });
      await admin.save();
      console.log('Default Admin created: admin@opinio.com / adminpassword123');
    }
  } catch (error) {
    console.error('Failed to seed admin:', error.message);
  }
};

app.use('/api', authRoutes);
app.use('/api', blogRoutes);
app.use('/api/admin', adminRoutes);

seedAdmin();
