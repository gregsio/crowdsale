require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
};

// task action function receives the Hardhat Runtime Environment as second argument
task(
  "blockNumber",
  "Prints the current block number",
  async (_, { ethers }) => {
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("Current block number: " + blockNumber);
  }
);

task(
  "whitelist",
  "Adds wallet addresses to the crowdsale whitelist",
  async (_, { ethers }) => {

    const crowdsale = await ethers.getContractAt('Crowdsale','0xe7f1725e7734ce288f8367e1bb143e90bb3f0512' )
    console.log ("token sold:"  + await crowdsale.tokenSold())

    const [owner, user1, user2, user3] = await ethers.getSigners();
    whitelist = [user1.address, user2.address, user3.address]

    transaction = await crowdsale.whitelistAdd(whitelist)
    result = await transaction.wait()

    console.log ("whitelist: " + user1.address + ': ' + await crowdsale.whitelist(user1.address))
    console.log ("whitelist: " + user2.address + ': ' + await crowdsale.whitelist(user2.address))
    console.log ("whitelist: " + user3.address + ': ' + await crowdsale.whitelist(user2.address))

  }
);

task(
  "openCrowdsale",
  "Open the crowdsale for the next 5 days",
  async (_, { ethers }) => {
  const crowdsale = await ethers.getContractAt('Crowdsale','0xe7f1725e7734ce288f8367e1bb143e90bb3f0512' )
  const dateInSecs = (Math.floor(new Date().getTime() / 1000) + (3600*24*5)); // current date + 5 days in seconds
  transaction = await crowdsale.crowndsaleClosingDate(dateInSecs)  // closes the crowdsale in 5 days
  result = await transaction.wait()
  }
);
