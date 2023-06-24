// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const NAME = 'SYZYGY'
  const SYMBOL = 'CZG'
  const MAX_SUPPLY = ethers.utils.parseUnits('1000000', 'ether')
  const PRICE = ethers.utils.parseUnits('0.025', 'ether')

// Deploy token
  const Token = await hre.ethers.getContractFactory('Token')
  let token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY)
  await token.deployed()
  console.log(`Token deployed to: ${token.address}\n`)

// Deploy crowdsale 
  const Crowdsale = await hre.ethers.getContractFactory('Crowdsale')
  let crowdsale = await Crowdsale.deploy(token.address, PRICE, MAX_SUPPLY)
  await crowdsale.deployed()
  console.log(`Crowdsale deployed to: ${crowdsale.address}\n`)

//Send tokens to crowdsale
  const transaction = await token.transfer(crowdsale.address, MAX_SUPPLY)
  await transaction.wait()
  console.log(`Tokens transfered to Crowdsale\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
