# Web3
installlation steps 
1. create a folder
2. smart-contracts/
├── contracts/
│   ├── CashbackRewards.sol    // Main cashback contract
│   └── RewardToken.sol        // ERC20 token contract
├── scripts/
│   └── deploy.js
└── test/
    └── CashbackRewards.test.js
3.in smart-contracts folder
  1. npm init -y
  2. npm install --save-dev hardhat
  3. npm install --save-dev @nomicfoundation/hardhat-toolbox
  4. npm install --save-dev solidity-coverage dotenv
  5. npm install @openzeppelin/contracts
  6. npx hardhat
4. you can check the version of hardhat by "npx hardhat --version" , kindly install every dependcies with the latest version
5. cd ..
6. mkdir backend
7. npm init -y
8. npm install express mongoose dotenv cors helmet morgan web3 ethers express-async-handler 
   jsonwebtoken bcryptjs
9. npm install --save-dev nodemon
10. there will be a file in backend with server.js
11. create .env file in backend
     # backend/.env
    NODE_ENV=production
    PORT=5000
    MONGO_URI=your url
    JWT_SECRET=yourkey
    CONTRACT_ADDRESS=your_deployed_contract_address
    WEB3_PROVIDER_URL=http://localhost:8545
  
     
