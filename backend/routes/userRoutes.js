// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUserWallet,
  getUserProfile,
  getNonce,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(registerUser);
router.post('/login/wallet', authUserWallet);
router.route('/profile').get(protect, getUserProfile);
router.get('/nonce/:walletAddress', getNonce);

module.exports = router;
