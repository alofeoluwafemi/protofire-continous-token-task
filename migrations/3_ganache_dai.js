const GanacheDai = artifacts.require("GanacheDai");
const ContinousToken = artifacts.require("ContinousToken");
const {deployerWallet, account1Wallet, account2Wallet} = require('../scripts/helpers/common')

module.exports = async function (deployer) {
  process.env.NETWORK = deployer.network;
  
  await deployer.deploy(GanacheDai, [deployerWallet.address, account1Wallet.address, account2Wallet.address]);

  const deployedToken = await GanacheDai.deployed();

  deployer.deploy(ContinousToken, 500000, deployedToken.address).catch(error => console.log(error));
};
