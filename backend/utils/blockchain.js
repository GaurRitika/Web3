// backend/utils/blockchain.js
const ethers = require('ethers');
const CashbackRewardsABI = require('../abis/CashbackRewards.json');
const RewardTokenABI = require('../abis/RewardToken.json');

// Initialize provider
const getProvider = () => {
  return new ethers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
};
// Get network information
const getNetworkInfo = async () => {
  const provider = getProvider();
  const network = await provider.getNetwork();
  return {
    name: network.name,
    chainId: network.chainId,
    ensAddress: network.ensAddress,
  };
};

// Initialize signer with private key
const getSigner = () => {
  const provider = getProvider();
  return new ethers.Wallet(process.env.PRIVATE_KEY, provider);
};

// Get CashbackRewards contract instance
const getCashbackContract = () => {
  const signer = getSigner();
  return new ethers.Contract(
    process.env.CASHBACK_CONTRACT_ADDRESS,
    CashbackRewardsABI.abi,
    signer
  );
};

// Get RewardToken contract instance
const getRewardTokenContract = () => {
  const signer = getSigner();
  return new ethers.Contract(
    process.env.REWARD_TOKEN_ADDRESS,
    RewardTokenABI.abi,
    signer
  );
};

// Listen for CashbackIssued events
const listenForCashbackEvents = (callback) => {
  const cashbackContract = getCashbackContract();
  
  cashbackContract.on('CashbackIssued', (
    transactionId, 
    userAddress, 
    merchantAddress, 
    amount, 
    cashbackAmount, 
    event
  ) => {
    callback({
      transactionId: transactionId.toNumber(),
      userAddress,
      merchantAddress,
      amount: ethers.utils.formatEther(amount),
      cashbackAmount: ethers.utils.formatEther(cashbackAmount),
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
    });
  });
};

module.exports = {
  getProvider,
  getSigner,
  getCashbackContract,
  getRewardTokenContract,
  listenForCashbackEvents,
};
