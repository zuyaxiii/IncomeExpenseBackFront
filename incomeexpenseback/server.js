import express from 'express';
import cors from 'cors';
import connectDB from './config/MongoDB.js'
import transactionsRoutes from './models/transactions/transactionsRoutes.js';
import dotenv from 'dotenv';
import authRoutes from './models/user/authRoutes.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
  }));
app.use(express.json())

connectDB()

app.use('/auth', authRoutes);
app.use('/transactions' , transactionsRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));