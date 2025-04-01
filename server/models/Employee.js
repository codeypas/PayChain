import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  department: {
    type: String,
    required: false
  },
  salary: {
    type: String,
    required: true
  },
  onChain: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Employee', EmployeeSchema);
