// backend/routes/merchantRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMerchants,
  getMerchantById,
  registerMerchant,
  updateMerchant,
} = require('../controllers/merchantController');
const { protect, admin, merchantAuth } = require('../middleware/authMiddleware');

router.route('/')
  .get(getMerchants)
  .post(protect, admin, registerMerchant);

router.route('/:id')
  .get(getMerchantById)
  .put(protect, admin, updateMerchant);

module.exports = router;
