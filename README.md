# PayChain - Web3-Based Instant Salary Payment System 💰🚀

## Overview
PayChain is a decentralized payroll system that enables **real-time salary payments** using smart contracts. Employees receive payments automatically **every 30 minutes** based on their work hours, directly into their **MetaMask** wallet.

## Features
- **Instant Salary Payments** - Employees are paid every 30 minutes.
- **Smart Contract Automation** - Eliminates manual payroll processing.
- **Crypto Payments** - Salaries are paid in ETH or USDT.
- **Transparent Records** - All transactions are recorded on-chain.
- **Easy Wallet Integration** - Supports MetaMask.

## Tech Stack
- **Blockchain:** Ethereum (or Polygon for lower gas fees)
- **Smart Contracts:** Solidity (ERC-20 based salary system)
- **Frontend:** React.js + Web3.js
- **Backend:** Node.js + Express.js
- **Database:** Firebase / MongoDB (for employer-employee records)
- **Wallet Integration:** MetaMask, WalletConnect

## Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/codeypas/paychain.git
cd paychain
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start the Backend Server
```bash
cd server
npm install
npm run dev
```

### 4️⃣ Start the Frontend
```bash
cd client
npm install
npm start
```

### 5️⃣ Deploy Smart Contract
1. Install Hardhat:
   ```bash
   npm install --save-dev hardhat
   ```
2. Compile and Deploy:
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network goerli
   ```

## Smart Contract Setup: Getting Contract Address

After deploying your contract, retrieve the contract address:

### Using Truffle:
```bash
cd paychain/truffle
truffle migrate --network development
```
Check the deployment output for the contract address.

### Using Truffle Console:
```bash
truffle console --network development
let instance = await PayrollSystem.deployed()
instance.address
```

### From Ganache UI:
1. Open Ganache
2. Navigate to "Contracts" tab
3. Find `PayrollSystem` contract
4. Copy the displayed contract address

## Connecting MetaMask to Ganache

### Step 1: Install MetaMask
1. Go to [MetaMask Download](https://metamask.io/download/)
2. Install the extension
3. Create a new wallet

### Step 2: Add Ganache as a Network in MetaMask
1. Open MetaMask
2. Click "Add Network"
3. Fill in the following details:
   - **Network Name:** `Ganache Local`
   - **New RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `1337`
   - **Currency Symbol:** `ETH`
4. Click "Save"

### Step 3: Import a Ganache Account to MetaMask
1. Copy the private key of an account from Ganache
2. In MetaMask, select **Import Account**
3. Paste the private key and click "Import"

## Testing the Connection

### Start your backend server:
```bash
cd paychain/server
npm run dev
```

### Start your frontend application:
```bash
cd paychain/client
npm start
```

### Open the app and test transactions:
1. Navigate to `http://localhost:3000`
2. Click "Connect MetaMask"
3. Use employer functions to add employees and deposit salary funds

## Troubleshooting

### MetaMask Not Connecting
- Ensure Ganache is running
- Verify MetaMask network settings
- Reset MetaMask (Settings > Advanced > Reset Account)

### Contract Not Found
- Verify contract address in frontend/backend
- Ensure contract is deployed to Ganache

### Transaction Errors
- Ensure sufficient ETH balance
- Use the correct account for operations

By following these steps, you can successfully set up and test PayChain locally before deploying to a testnet or mainnet.

## Contributing
Feel free to contribute by forking the repo and submitting a pull request. 🚀

## License
MIT License

---
"Innovation distinguishes between a leader and a follower." – Steve Jobs
