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
// app.use(cors());

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));

// Pre-flight requests
app.options('*', cors());


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





// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
// import Web3 from 'web3';


// import contractABI from './contractABI.json' assert { type: 'json' };

// // Load environment variables
// dotenv.config();

// const providerUrl = process.env.PROVIDER_URL;

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // IMPORTANT: Apply CORS before any other middleware or routes
// app.use(cors({
//   origin: '*', // Allow all origins for testing
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Handle preflight requests
// app.options('*', cors());

// // Body parser middleware
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Initialize Web3
// const web3 = new Web3(process.env.PROVIDER_URL);
// // const contractABI = require('./contractABI.json');
// const contractAddress = process.env.CONTRACT_ADDRESS;

// console.log('Initializing Web3 with:');
// console.log('- Provider URL:', process.env.PROVIDER_URL);
// console.log('- Contract Address:', contractAddress);

// // Create contract instance
// const contract = new web3.eth.Contract(contractABI, contractAddress);

// // Verify contract connection
// contract.methods.owner().call()
//   .then(owner => {
//     console.log('Contract owner:', owner);
    
//     // Check contract balance
//     return web3.eth.getBalance(contractAddress);
//   })
//   .then(balance => {
//     console.log('Contract balance (wei):', balance);
//     console.log('Contract balance (ETH):', web3.utils.fromWei(balance, 'ether'));
//   })
//   .catch(err => console.error('Error connecting to contract:', err));

// // Make web3 and contract available to routes
// app.use((req, res, next) => {
//   req.web3 = web3;
//   req.contract = contract;
//   next();
// });

// // Basic test route
// app.get('/api/test', (req, res) => {
//   res.status(200).json({ status: 'ok', message: 'Server is running' });
// });

// // Import routes
// const employeeRoutes = require('./routes/employees');
// const transactionRoutes = require('./routes/transactions');

// // Routes
// app.use('/api/employees', employeeRoutes);
// app.use('/api/transactions', transactionRoutes);

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Test the API at http://localhost:${PORT}/api/test`);
// });