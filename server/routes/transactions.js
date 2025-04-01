import express from 'express'; // Use import instead of require
import Web3 from 'web3';
import Transaction from '../models/Transaction.js'; // Correct ES module import

const router = express.Router();

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ timestamp: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get on-chain transactions
router.get('/on-chain', async (req, res) => {
  try {
    const contract = req.contract;
    const web3 = req.web3;

    // Get payment events
    const paymentEvents = await contract.getPastEvents('SalaryPaid', {
      fromBlock: 0,
      toBlock: 'latest'
    });

    // Get deposit events
    const depositEvents = await contract.getPastEvents('FundsDeposited', {
      fromBlock: 0,
      toBlock: 'latest'
    });

    // Process payment events
    const payments = await Promise.all(paymentEvents.map(async (event) => {
      const block = await web3.eth.getBlock(event.blockNumber);
      return {
        employeeAddress: event.returnValues.employeeAddress,
        amount: Web3.utils.fromWei(event.returnValues.amount, 'ether'),
        transactionHash: event.transactionHash,
        timestamp: new Date(block.timestamp * 1000),
        type: 'payment'
      };
    }));

    // Process deposit events
    const deposits = await Promise.all(depositEvents.map(async (event) => {
      const block = await web3.eth.getBlock(event.blockNumber);
      return {
        employeeAddress: event.returnValues.from,
        amount: Web3.utils.fromWei(event.returnValues.amount, 'ether'),
        transactionHash: event.transactionHash,
        timestamp: new Date(block.timestamp * 1000),
        type: 'deposit'
      };
    }));

    // Combine and sort by timestamp (newest first)
    const allTransactions = [...payments, ...deposits].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );

    res.json(allTransactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get transactions for a specific employee
router.get('/employee/:address', async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      employeeAddress: req.params.address.toLowerCase() 
    }).sort({ timestamp: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new transaction (for tracking off-chain)
router.post('/', async (req, res) => {
  const transaction = new Transaction({
    employeeAddress: req.body.employeeAddress,
    amount: req.body.amount,
    transactionHash: req.body.transactionHash,
    timestamp: req.body.timestamp || Date.now(),
    type: req.body.type || 'payment'
  });

  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
