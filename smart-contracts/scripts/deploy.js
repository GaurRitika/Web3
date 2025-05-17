const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy RewardToken
  console.log("Deploying RewardToken...");
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const initialSupply = 1000000; // 1 million tokens
  const rewardToken = await RewardToken.deploy(initialSupply);
  await rewardToken.waitForDeployment();
  const rewardTokenAddress = await rewardToken.target;
  console.log("RewardToken deployed to:", rewardTokenAddress);

  // Deploy CashbackRewards
  console.log("Deploying CashbackRewards...");
  const CashbackRewards = await hre.ethers.getContractFactory("CashbackRewards");
  const cashbackRewards = await CashbackRewards.deploy(rewardTokenAddress);
  await cashbackRewards.waitForDeployment();
  const cashbackRewardsAddress = await cashbackRewards.target;
  console.log("CashbackRewards deployed to:", cashbackRewardsAddress);

  // Transfer ownership of RewardToken to CashbackRewards
  console.log("Transferring RewardToken ownership to CashbackRewards...");
  await rewardToken.transferOwnership(cashbackRewardsAddress);
  console.log("RewardToken ownership transferred successfully");

  // Save deployment info
  if (hre.network.name !== 'hardhat' && hre.network.name !== 'localhost') {
    console.log("Saving deployment information...");
    const deploymentInfo = {
      network: hre.network.name,
      rewardTokenAddress: rewardTokenAddress,
      cashbackRewardsAddress: cashbackRewardsAddress,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
    };
    
    fs.writeFileSync(
      "deployment.json",
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("Deployment information saved to deployment.json");
  }

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });