import express from 'express';  // Replace `require` with `import`
import Web3 from 'web3';
import Transaction from '../models/Transaction.js';  // Ensure ES module import

const router = express.Router();


// testing the API directly
//http://localhost:5002/api/employees/test

router.get('/test', (req, res) => {
  res.json({ message: 'Employees API is working' });
});

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Get on-chain employees
// router.get('/on-chain', async (req, res) => {
//   try {
//     const contract = req.contract;
//     const count = await contract.methods.getEmployeeCount().call();
//     const employeeList = [];

//     for (let i = 0; i < count; i++) {
//       const address = await contract.methods.employeeAddresses(i).call();
//       const details = await contract.methods.getEmployeeDetails(address).call();

//       employeeList.push({
//         address,
//         salary: Web3.utils.fromWei(details.salary, 'ether'),
//         lastPayment: new Date(details.lastPayment * 1000),
//         active: details.active
//       });
//     }

//     res.json(employeeList);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });



router.get('/on-chain', async (req, res) => {
  try {
    const contract = req.contract;
    const count = await contract.methods.getEmployeeCount().call();
    const employeeList = [];
    
    for (let i = 0; i < count; i++) {
      const address = await contract.methods.employeeAddresses(i).call();
      const details = await contract.methods.getEmployeeDetails(address).call();
      
      employeeList.push({
        address,
        salary: Web3.utils.fromWei(details.salary, 'ether'),
        lastPayment: new Date(details.lastPayment * 1000),
        active: details.active
      });
    }
    
    res.json(employeeList);
  } catch (err) {
    console.error('Error in /on-chain route:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add a new employee
router.post('/', async (req, res) => {
  const employee = new Employee({
    address: req.body.address,
    name: req.body.name,
    email: req.body.email,
    department: req.body.department,
    salary: req.body.salary
  });

  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific employee
router.get('/:address', async (req, res) => {
  try {
    const employee = await Employee.findOne({ address: req.params.address.toLowerCase() });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Get on-chain details if available
    try {
      const contract = req.contract;
      const details = await contract.methods.getEmployeeDetails(req.params.address).call();

      const onChainDetails = {
        salary: Web3.utils.fromWei(details.salary, 'ether'),
        lastPayment: new Date(details.lastPayment * 1000),
        active: details.active,
        nextPaymentTime: new Date((parseInt(details.lastPayment) + parseInt(await contract.methods.paymentInterval().call())) * 1000)
      };

      res.json({ ...employee.toObject(), onChain: true, onChainDetails });
    } catch (error) {
      // Return just the database record if on-chain details aren't available
      res.json(employee);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an employee
router.patch('/:address', async (req, res) => {
  try {
    const employee = await Employee.findOne({ address: req.params.address.toLowerCase() });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    if (req.body.name) employee.name = req.body.name;
    if (req.body.email) employee.email = req.body.email;
    if (req.body.department) employee.department = req.body.department;
    if (req.body.salary) employee.salary = req.body.salary;
    if (req.body.onChain !== undefined) employee.onChain = req.body.onChain;

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an employee not working
router.delete('/:address', async (req, res) => {
  try {
    const employee = await Employee.findOne({ address: req.params.address.toLowerCase() });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    await employee.deleteOne();
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
