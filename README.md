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
