// backend/models/transactionModel.js
const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    transactionId: {
      type: Number,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userWalletAddress: {
      type: String,
      required: true,
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
    },
    merchantWalletAddress: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    cashbackAmount: {
      type: Number,
      required: true,
    },
    blockchainTransactionHash: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
