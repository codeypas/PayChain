import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Web3 from 'web3';
import employeeRoutes from './routes/employees.js';
import transactionRoutes from './routes/transactions.js';
import contractABI from './contractABI.json' assert { type: 'json' };

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize Web3
const web3 = new Web3(process.env.PROVIDER_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;

// Middleware to add Web3 instance to requests
app.use((req, res, next) => {
  req.web3 = web3;
  req.contract = new web3.eth.Contract(contractABI, contractAddress);
  next();
});

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
