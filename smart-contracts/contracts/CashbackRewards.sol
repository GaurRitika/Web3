// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CashbackRewards
 * @dev A contract that manages a crypto cashback rewards system
 */
contract CashbackRewards is Ownable, ReentrancyGuard {
    // ERC20 token used for rewards
    IERC20 public rewardsToken;
    
    // Merchant structure
    struct Merchant {
        bool isRegistered;
        uint256 cashbackRate; // Rate in basis points (1/100 of a percent) - e.g., 500 = 5%
        uint256 totalRewardsDistributed;
        address merchantWallet;
    }
    
    // User structure
    struct User {
        bool exists;
        uint256 totalCashbackEarned;
        uint256 availableCashback;
    }
    
    // Transaction structure
    struct Transaction {
        uint256 id;
        address user;
        address merchant;
        uint256 amount;
        uint256 cashbackAmount;
        uint256 timestamp;
    }
    
    // Mappings
    mapping(address => Merchant) public merchants;
    mapping(address => User) public users;
    mapping(uint256 => Transaction) public transactions;
    
    // Transaction counter
    uint256 public transactionCount;
    
    // Events
    event MerchantRegistered(address indexed merchantWallet, uint256 cashbackRate);
    event MerchantUpdated(address indexed merchantWallet, uint256 newCashbackRate);
    event MerchantRemoved(address indexed merchantWallet);
    event CashbackIssued(
        uint256 indexed transactionId, 
        address indexed user, 
        address indexed merchant, 
        uint256 amount, 
        uint256 cashbackAmount
    );
    event CashbackWithdrawn(address indexed user, uint256 amount);
    
    /**
     * @dev Constructor sets the rewards token address
     * @param _rewardsToken Address of the ERC20 token used for rewards
     */
    constructor(address _rewardsToken) {
        rewardsToken = IERC20(_rewardsToken);
    }
    
    /**
     * @dev Register a new merchant
     * @param _merchantWallet Merchant's wallet address
     * @param _cashbackRate Cashback rate in basis points
     */
    function registerMerchant(address _merchantWallet, uint256 _cashbackRate) external onlyOwner {
        require(_merchantWallet != address(0), "Invalid merchant address");
        require(!merchants[_merchantWallet].isRegistered, "Merchant already registered");
        require(_cashbackRate <= 10000, "Cashback rate cannot exceed 100%");
        
        merchants[_merchantWallet] = Merchant({
            isRegistered: true,
            cashbackRate: _cashbackRate,
            totalRewardsDistributed: 0,
            merchantWallet: _merchantWallet
        });
        
        emit MerchantRegistered(_merchantWallet, _cashbackRate);
    }
    
    /**
     * @dev Update merchant's cashback rate
     * @param _merchantWallet Merchant's wallet address
     * @param _newCashbackRate New cashback rate in basis points
     */
    function updateMerchantCashbackRate(address _merchantWallet, uint256 _newCashbackRate) external onlyOwner {
        require(merchants[_merchantWallet].isRegistered, "Merchant not registered");
        require(_newCashbackRate <= 10000, "Cashback rate cannot exceed 100%");
        
        merchants[_merchantWallet].cashbackRate = _newCashbackRate;
        
        emit MerchantUpdated(_merchantWallet, _newCashbackRate);
    }
    
    /**
     * @dev Remove a merchant
     * @param _merchantWallet Merchant's wallet address
     */
    function removeMerchant(address _merchantWallet) external onlyOwner {
        require(merchants[_merchantWallet].isRegistered, "Merchant not registered");
        
        delete merchants[_merchantWallet];
        
        emit MerchantRemoved(_merchantWallet);
    }
    
    /**
     * @dev Issue cashback to a user after a purchase
     * @param _user User's wallet address
     * @param _purchaseAmount Amount of the purchase in smallest unit
     */
    function issueCashback(address _user, uint256 _purchaseAmount) external nonReentrant {
        require(merchants[msg.sender].isRegistered, "Only registered merchants can issue cashback");
        require(_user != address(0), "Invalid user address");
        require(_purchaseAmount > 0, "Purchase amount must be greater than zero");
        
        // Create user if doesn't exist
        if (!users[_user].exists) {
            users[_user] = User({
                exists: true,
                totalCashbackEarned: 0,
                availableCashback: 0
            });
        }
        
        // Calculate cashback amount
        uint256 cashbackAmount = (_purchaseAmount * merchants[msg.sender].cashbackRate) / 10000;
        
        // Update merchant stats
        merchants[msg.sender].totalRewardsDistributed += cashbackAmount;
        
        // Update user stats
        users[_user].totalCashbackEarned += cashbackAmount;
        users[_user].availableCashback += cashbackAmount;
        
        // Record transaction
        uint256 transactionId = transactionCount++;
        transactions[transactionId] = Transaction({
            id: transactionId,
            user: _user,
            merchant: msg.sender,
            amount: _purchaseAmount,
            cashbackAmount: cashbackAmount,
            timestamp: block.timestamp
        });
        
        // Transfer tokens from merchant to contract
        require(rewardsToken.transferFrom(msg.sender, address(this), cashbackAmount), "Token transfer failed");
        
        emit CashbackIssued(transactionId, _user, msg.sender, _purchaseAmount, cashbackAmount);
    }
    
    /**
     * @dev Allow users to withdraw their available cashback
     * @param _amount Amount to withdraw
     */
    function withdrawCashback(uint256 _amount) external nonReentrant {
        require(users[msg.sender].exists, "User does not exist");
        require(_amount > 0, "Amount must be greater than zero");
        require(_amount <= users[msg.sender].availableCashback, "Insufficient available cashback");
        
        // Update user's available cashback
        users[msg.sender].availableCashback -= _amount;
        
        // Transfer tokens to user
        require(rewardsToken.transfer(msg.sender, _amount), "Token transfer failed");
        
        emit CashbackWithdrawn(msg.sender, _amount);
    }
    
    /**
     * @dev Get user's available cashback
     * @param _user User's wallet address
     * @return User's available cashback amount
     */
    function getAvailableCashback(address _user) external view returns (uint256) {
        return users[_user].availableCashback;
    }
    
    /**
     * @dev Get merchant's cashback rate
     * @param _merchant Merchant's wallet address
     * @return Merchant's cashback rate in basis points
     */
    function getMerchantCashbackRate(address _merchant) external view returns (uint256) {
        return merchants[_merchant].cashbackRate;
    }
    
    /**
     * @dev Check if an address is a registered merchant
     * @param _merchant Address to check
     * @return True if the address is a registered merchant
     */
    function isMerchant(address _merchant) external view returns (bool) {
        return merchants[_merchant].isRegistered;
    }
}
