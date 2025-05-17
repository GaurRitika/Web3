// frontend/src/utils/web3.js
import Web3 from 'web3';
import { ethers } from 'ethers';
import CashbackRewardsABI from '../contracts/CashbackRewards.json';
import RewardTokenABI from '../contracts/RewardToken.json';

// Contract addresses (these should be updated after deployment)
const CASHBACK_CONTRACT_ADDRESS = import.meta.env.VITE_CASHBACK_CONTRACT_ADDRESS;
const REWARD_TOKEN_ADDRESS = import.meta.env.VITE_REWARD_TOKEN_ADDRESS;
const NETWORK_ID = import.meta.env.VITE_NETWORK_ID || '11155111'; // Default to Sepolia
// Get Web3 provider
export const getWeb3 = () => {
  return new Promise((resolve) => {
    // Modern dapp browsers
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      resolve(web3);
    }
    // Legacy dapp browsers
    else if (window.web3) {
      const web3 = new Web3(window.web3.currentProvider);
      resolve(web3);
    }
    // Fallback to local provider
    else {
      const provider = new Web3.providers.HttpProvider(
        `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`
      );
      const web3 = new Web3(provider);
      resolve(web3);
    }
  });
};
// Get ethers provider
export const getEthersProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  // Fallback to Alchemy provider
  return new ethers.providers.JsonRpcProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`
  );
};

// Get ethers signer
export const getEthersSigner = () => {
  const provider = getEthersProvider();
  if (provider) {
    return provider.getSigner();
  }
  return null;
};

// Get CashbackRewards contract
export const getCashbackContract = () => {
  const signer = getEthersSigner();
  if (signer && CASHBACK_CONTRACT_ADDRESS) {
    return new ethers.Contract(
      CASHBACK_CONTRACT_ADDRESS,
      CashbackRewardsABI.abi,
      signer
    );
  }
  return null;
};

// Get RewardToken contract
export const getRewardTokenContract = () => {
  const signer = getEthersSigner();
  if (signer && REWARD_TOKEN_ADDRESS) {
    return new ethers.Contract(
      REWARD_TOKEN_ADDRESS,
      RewardTokenABI.abi,
      signer
    );
  }
  return null;
};

// Format Ether value to human-readable format
export const formatEther = (value) => {
  return ethers.utils.formatEther(value);
};

// Parse Ether value from human-readable format
export const parseEther = (value) => {
  return ethers.utils.parseEther(value.toString());
};

// Check if the network is supported
export const isSupportedNetwork = (networkId) => {
  // Add Sepolia network ID (11155111)
  const supportedNetworks = ['11155111', '1', '4', '137', '80001']; // Sepolia, Mainnet, Rinkeby, Polygon, Mumbai
  return supportedNetworks.includes(networkId);
};

// Update the getNetworkName function
export const getNetworkName = (networkId) => {
  const networks = {
    '1': 'Ethereum Mainnet',
    '3': 'Ropsten Testnet',
    '4': 'Rinkeby Testnet',
    '5': 'Goerli Testnet',
    '11155111': 'Sepolia Testnet',
    '137': 'Polygon Mainnet',
    '80001': 'Mumbai Testnet',
  };
  return networks[networkId] || 'Unknown Network';
};

// frontend/src/utils/web3.js (additional function)

// Function to request network switch to Sepolia
export const switchToSepolia = async () => {
  if (!window.ethereum) return false;
  
  try {
    // Try to switch to Sepolia
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // 0xaa36a7 is hex for 11155111 (Sepolia)
    });
    return true;
  } catch (switchError) {
    // This error code means the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xaa36a7',
              chainName: 'Sepolia Testnet',
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Error adding Sepolia network:', addError);
        return false;
      }
    }
    console.error('Error switching to Sepolia:', switchError);
    return false;
  }
};

