// test/CashbackRewards.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CashbackRewards", function () {
  let RewardToken, rewardToken;
  let CashbackRewards, cashbackRewards;
  let owner, merchant, user, addr3;
  
  const initialSupply = 1000000; // 1 million tokens
  const cashbackRate = 500; // 5%
  
  beforeEach(async function () {
    // Get signers
    [owner, merchant, user, addr3] = await ethers.getSigners();
    
    // Deploy RewardToken
    RewardToken = await ethers.getContractFactory("RewardToken");
    rewardToken = await RewardToken.deploy(initialSupply);
    await rewardToken.deployed();
    
    // Deploy CashbackRewards
    CashbackRewards = await ethers.getContractFactory("CashbackRewards");
    cashbackRewards = await CashbackRewards.deploy(rewardToken.address);
    await cashbackRewards.deployed();
    
    // Register merchant
    await cashbackRewards.registerMerchant(merchant.address, cashbackRate);
    
    // Transfer tokens to merchant for cashback
    await rewardToken.transfer(merchant.address, ethers.utils.parseEther("10000"));
  });
  
  describe("Merchant Management", function () {
    it("Should register a merchant correctly", async function () {
      // Check if merchant is registered
      expect(await cashbackRewards.isMerchant(merchant.address)).to.equal(true);
      expect(await cashbackRewards.getMerchantCashbackRate(merchant.address)).to.equal(cashbackRate);
    });
    
    it("Should update merchant's cashback rate", async function () {
      const newRate = 700; // 7%
      await cashbackRewards.updateMerchantCashbackRate(merchant.address, newRate);
      expect(await cashbackRewards.getMerchantCashbackRate(merchant.address)).to.equal(newRate);
    });
    
    it("Should remove a merchant", async function () {
      await cashbackRewards.removeMerchant(merchant.address);
      expect(await cashbackRewards.isMerchant(merchant.address)).to.equal(false);
    });
  });
  
  describe("Cashback Operations", function () {
    it("Should issue cashback correctly", async function () {
      const purchaseAmount = ethers.utils.parseEther("100");
      const expectedCashback = purchaseAmount.mul(cashbackRate).div(10000);
      
      // Approve tokens for cashback
      await rewardToken.connect(merchant).approve(cashbackRewards.address, expectedCashback);
      
      // Issue cashback
      await cashbackRewards.connect(merchant).issueCashback(user.address, purchaseAmount);
      
      // Check user's cashback
      expect(await cashbackRewards.getAvailableCashback(user.address)).to.equal(expectedCashback);
    });
    
    it("Should allow users to withdraw cashback", async function () {
      const purchaseAmount = ethers.utils.parseEther("100");
      const expectedCashback = purchaseAmount.mul(cashbackRate).div(10000);
      
      // Approve tokens for cashback
      await rewardToken.connect(merchant).approve(cashbackRewards.address, expectedCashback);
      
      // Issue cashback
      await cashbackRewards.connect(merchant).issueCashback(user.address, purchaseAmount);
      
      // Check user's balance before withdrawal
      const balanceBefore = await rewardToken.balanceOf(user.address);
      
      // Withdraw cashback
      await cashbackRewards.connect(user).withdrawCashback(expectedCashback);
      
      // Check user's balance after withdrawal
      const balanceAfter = await rewardToken.balanceOf(user.address);
      expect(balanceAfter.sub(balanceBefore)).to.equal(expectedCashback);
      
      // Check user's available cashback
      expect(await cashbackRewards.getAvailableCashback(user.address)).to.equal(0);
    });
  });
});
