// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardToken
 * @dev A simple ERC20 token for cashback rewards
 */
contract RewardToken is ERC20, Ownable {
    /**
     * @dev Constructor creates the token with initial supply to the deployer
     * @param initialSupply Initial token supply (in full tokens, not wei)
     */
    constructor(uint256 initialSupply) ERC20("Cashback Reward Token", "CASH") {
        _mint(msg.sender, initialSupply * 10**decimals());
    }
    
    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to receive the minted tokens
     * @param amount Amount to mint (in smallest unit)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
