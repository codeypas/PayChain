import express from 'express';

import cors from 'cors';

const app = express();
const PORT = 5003;

// Enable CORS for all routes
app.use(cors());

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log(`Test at http://localhost:${PORT}/api/test`);
});