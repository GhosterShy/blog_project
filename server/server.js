import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blogs.js';
import commentRoutes from './routes/comments.js';

dotenv.config();

const app = express();


const isVercel = !!process.env.VERCEL; 
const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

app.use(cors({
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);

  
    const allowed = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      vercelUrl
    ].filter(Boolean);

    if (allowed.includes(origin)) {
      return callback(null, true);
    }


    if (isVercel) {
      return callback(null, true);
    }


    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/blogs', commentRoutes); 


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));


export default app;


if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}