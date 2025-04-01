import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  employeeAddress: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  amount: {
    type: Number, // ✅ Store as a number for calculations
    required: true,
    min: [0, 'Amount must be a positive number']
  },
  transactionHash: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // ✅ Ensure hash is always lowercase
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    immutable: true // ✅ Prevent modification of transaction time
  },
  type: {
    type: String,
    enum: ['payment', 'deposit', 'withdrawal'],
    default: 'payment'
  }
});

export default mongoose.model('Transaction', TransactionSchema);
