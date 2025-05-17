// backend/controllers/transactionController.js
const asyncHandler = require('express-async-handler');
const ethers = require('ethers');
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const Merchant = require('../models/merchantModel');
const { getCashbackContract, getRewardTokenContract } = require('../utils/blockchain');

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
const getUserTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .populate('merchant', 'name logo')
    .sort({ createdAt: -1 });
  
  res.json(transactions);
});

// @desc    Process a new cashback transaction
// @route   POST /api/transactions
// @access  Private/Merchant
const processTransaction = asyncHandler(async (req, res) => {
  const { userWalletAddress, amount } = req.body;
  
  // Validate input
  if (!userWalletAddress || !amount || amount <= 0) {
    res.status(400);
    throw new Error('Please provide valid user wallet address and amount');
  }
  
  // Find merchant
  const merchant = await Merchant.findOne({ walletAddress: req.merchant.walletAddress });
  if (!merchant) {
    res.status(404);
    throw new Error('Merchant not found');
  }
  
  // Find or create user
  let user = await User.findOne({ walletAddress: userWalletAddress });
  if (!user) {
    user = await User.create({
      walletAddress: userWalletAddress,
      nonce: Math.floor(Math.random() * 1000000).toString(),
    });
  }
  
  // Calculate cashback amount
  const cashbackAmount = (amount * merchant.cashbackRate) / 100;
  
  try {
    // Get contracts
    const cashbackContract = getCashbackContract();
    const rewardTokenContract = getRewardTokenContract();
    
    // Approve tokens for cashback contract
    const amountInWei = ethers.utils.parseEther(cashbackAmount.toString());
    const approveTx = await rewardTokenContract.approve(cashbackContract.address, amountInWei);
    await approveTx.wait();
    
    // Issue cashback on blockchain
    const tx = await cashbackContract.issueCashback(
      userWalletAddress,
      ethers.utils.parseEther(amount.toString())
    );
    const receipt = await tx.wait();
    
    // Create transaction record in database
    const transaction = await Transaction.create({
      transactionId: Date.now(), // Temporary ID until we get the event from blockchain
      user: user._id,
      userWalletAddress,
      merchant: merchant._id,
      merchantWalletAddress: merchant.walletAddress,
      amount,
      cashbackAmount,
      blockchainTransactionHash: receipt.transactionHash,
      status: 'completed',
    });
    
    // Update user's total cashback earned
    user.totalCashbackEarned += cashbackAmount;
    await user.save();
    
    // Update merchant's total rewards distributed
    merchant.totalRewardsDistributed += cashbackAmount;
    await merchant.save();
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Blockchain transaction error:', error);
    res.status(500);
    throw new Error('Failed to process cashback transaction');
  }
});

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('merchant', 'name logo')
    .populate('user', 'walletAddress');
  
  if (transaction) {
    // Check if user is authorized to view this transaction
    if (
      transaction.user._id.toString() === req.user._id.toString() ||
      transaction.merchant.walletAddress === req.merchant?.walletAddress
    ) {
      res.json(transaction);
    } else {
      res.status(403);
      throw new Error('Not authorized to access this transaction');
    }
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

module.exports = {
  getUserTransactions,
  processTransaction,
  getTransactionById,
};
