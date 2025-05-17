// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const ethers = require('ethers');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { getCashbackContract } = require('../utils/blockchain');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Generate a random nonce
const generateNonce = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { walletAddress, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ walletAddress });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create new user
  const user = await User.create({
    walletAddress,
    email,
    password,
    nonce: generateNonce(),
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      walletAddress: user.walletAddress,
      email: user.email,
      nonce: user.nonce,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token using wallet signature
// @route   POST /api/users/login/wallet
// @access  Public
const authUserWallet = asyncHandler(async (req, res) => {
  const { walletAddress, signature } = req.body;

  // Find user by wallet address
  let user = await User.findOne({ walletAddress });

  // If user doesn't exist, create one
  if (!user) {
    user = await User.create({
      walletAddress,
      nonce: generateNonce(),
    });
  }

  // Verify signature
  const message = `Sign this message to authenticate with nonce: ${user.nonce}`;
  const recoveredAddress = ethers.utils.verifyMessage(message, signature);

  if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
    // Update nonce for security
    user.nonce = generateNonce();
    await user.save();

    // Get on-chain data
    const cashbackContract = getCashbackContract();
    const availableCashback = await cashbackContract.getAvailableCashback(walletAddress);

    // Update user data from blockchain
    user.availableCashback = ethers.utils.formatEther(availableCashback);
    await user.save();

    res.json({
      _id: user._id,
      walletAddress: user.walletAddress,
      email: user.email,
      totalCashbackEarned: user.totalCashbackEarned,
      availableCashback: user.availableCashback,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid signature');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Get latest on-chain data
    const cashbackContract = getCashbackContract();
    const availableCashback = await cashbackContract.getAvailableCashback(user.walletAddress);

    // Update user data from blockchain
    user.availableCashback = ethers.utils.formatEther(availableCashback);
    await user.save();

    res.json({
      _id: user._id,
      walletAddress: user.walletAddress,
      email: user.email,
      totalCashbackEarned: user.totalCashbackEarned,
      availableCashback: user.availableCashback,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get nonce for wallet authentication
// @route   GET /api/users/nonce/:walletAddress
// @access  Public
const getNonce = asyncHandler(async (req, res) => {
  const { walletAddress } = req.params;

  // Find user by wallet address
  let user = await User.findOne({ walletAddress });

  // If user doesn't exist, create one
  if (!user) {
    user = await User.create({
      walletAddress,
      nonce: generateNonce(),
    });
  }

  res.json({ nonce: user.nonce });
});

module.exports = {
  registerUser,
  authUserWallet,
  getUserProfile,
  getNonce,
};
