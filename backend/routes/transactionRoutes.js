// backend/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUserTransactions,
  processTransaction,
  getTransactionById,
} = require('../controllers/transactionController');
const { protect, merchantAuth } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getUserTransactions)
  .post(merchantAuth, processTransaction);

router.route('/:id').get(protect, getTransactionById);

module.exports = router;
