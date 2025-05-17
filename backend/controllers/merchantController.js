// backend/controllers/merchantController.js
const asyncHandler = require('express-async-handler');
const Merchant = require('../models/merchantModel');
const { getCashbackContract } = require('../utils/blockchain');

// @desc    Get all merchants
// @route   GET /api/merchants
// @access  Public
const getMerchants = asyncHandler(async (req, res) => {
  const merchants = await Merchant.find({ isActive: true });
  res.json(merchants);
});

// @desc    Get merchant by ID
// @route   GET /api/merchants/:id
// @access  Public
const getMerchantById = asyncHandler(async (req, res) => {
  const merchant = await Merchant.findById(req.params.id);

  if (merchant) {
    res.json(merchant);
  } else {
    res.status(404);
    throw new Error('Merchant not found');
  }
});

// @desc    Register a new merchant
// @route   POST /api/merchants
// @access  Private/Admin
const registerMerchant = asyncHandler(async (req, res) => {
  const { walletAddress, name, description, website, logo, cashbackRate } = req.body;

  // Check if merchant already exists
  const merchantExists = await Merchant.findOne({ walletAddress });

  if (merchantExists) {
    res.status(400);
    throw new Error('Merchant already exists');
  }

  // Register merchant on blockchain
  const cashbackContract = getCashbackContract();
  const tx = await cashbackContract.registerMerchant(walletAddress, cashbackRate * 100); // Convert percentage to basis points
  await tx.wait();

  // Create merchant in database
  const merchant = await Merchant.create({
    walletAddress,
    name,
    description,
    website,
    logo,
    cashbackRate,
  });

  if (merchant) {
    res.status(201).json(merchant);
  } else {
    res.status(400);
    throw new Error('Invalid merchant data');
  }
});

// @desc    Update merchant
// @route   PUT /api/merchants/:id
// @access  Private/Admin
const updateMerchant = asyncHandler(async (req, res) => {
  const { name, description, website, logo, cashbackRate, isActive } = req.body;

  const merchant = await Merchant.findById(req.params.id);

  if (merchant) {
    // Update merchant data
    merchant.name = name || merchant.name;
    merchant.description = description || merchant.description;
    merchant.website = website || merchant.website;
    merchant.logo = logo || merchant.logo;
    merchant.isActive = isActive !== undefined ? isActive : merchant.isActive;
    
    // If cashback rate is updated, update on blockchain
    if (cashbackRate && cashbackRate !== merchant.cashbackRate) {
      const cashbackContract = getCashbackContract();
      const tx = await cashbackContract.updateMerchantCashbackRate(
        merchant.walletAddress, 
        cashbackRate * 100 // Convert percentage to basis points
      );
      await tx.wait();
      merchant.cashbackRate = cashbackRate;
    }

    const updatedMerchant = await merchant.save();
    res.json(updatedMerchant);
  } else {
    res.status(404);
    throw new Error('Merchant not found');
  }
});

module.exports = {
  getMerchants,
  getMerchantById,
  registerMerchant,
  updateMerchant,
};
