// backend/routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const Merchant = require('../models/merchantModel');
const { listenForCashbackEvents } = require('../utils/blockchain');

// Setup blockchain event listener
listenForCashbackEvents(async (eventData) => {
  try {
    // Find user by wallet address
    const user = await User.findOne({ walletAddress: eventData.userAddress });
    if (!user) return;

    // Find merchant by wallet address
    const merchant = await Merchant.findOne({ walletAddress: eventData.merchantAddress });
    if (!merchant) return;

    // Check if transaction already exists
    let transaction = await Transaction.findOne({ 
      transactionId: eventData.transactionId 
    });

    if (transaction) {
      // Update existing transaction
      transaction.blockchainTransactionHash = eventData.transactionHash;
      transaction.status = 'completed';
      await transaction.save();
    } else {
      // Create new transaction
      transaction = await Transaction.create({
        transactionId: eventData.transactionId,
        user: user._id,
        userWalletAddress: eventData.userAddress,
        merchant: merchant._id,
        merchantWalletAddress: eventData.merchantAddress,
        amount: parseFloat(eventData.amount),
        cashbackAmount: parseFloat(eventData.cashbackAmount),
        blockchainTransactionHash: eventData.transactionHash,
        status: 'completed',
      });
    }

    // Update user's total cashback earned
    user.totalCashbackEarned += parseFloat(eventData.cashbackAmount);
    await user.save();

    // Update merchant's total rewards distributed
    merchant.totalRewardsDistributed += parseFloat(eventData.cashbackAmount);
    await merchant.save();

    console.log(`Processed cashback event: Transaction ID ${eventData.transactionId}`);
  } catch (error) {
    console.error('Error processing cashback event:', error);
  }
});

// Webhook endpoint for manual testing
router.post(
  '/cashback-issued',
  asyncHandler(async (req, res) => {
    const eventData = req.body;
    
    // Process the event data (same logic as the event listener)
    // ...
    
    res.status(200).json({ message: 'Webhook received' });
  })
);

module.exports = router;
