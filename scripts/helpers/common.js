const {
  mnemonic,
  infura_id,
  private_key_address_1,
  private_key_address_2,
  private_key_address_3,
} = require("../../secret.json");
const { ethers } = require("ethers");
const network = process.env.NETWORK;
const isDev = (network == 'development');
const daiAbi = isDev ? (require("../../build/contracts/GanacheDai.json")).abi : require("../abis/dai.json");

const provider = new ethers.providers.JsonRpcProvider(
  isDev ? 'http://localhost:8545' : `https://rinkeby.infura.io/v3/${infura_id}`
);
const deployerWallet = new ethers.Wallet(private_key_address_1).connect(
  provider
);
const account1Wallet = new ethers.Wallet(private_key_address_2).connect(
  provider
);
const account2Wallet = new ethers.Wallet(private_key_address_3).connect(
  provider
);
const ContinousToken = artifacts.require("ContinousToken");
const GanacheDaiToken = artifacts.require("GanacheDai");
const {expectEvent, expectRevert} = require('@openzeppelin/test-helpers');

module.exports = {
    daiAbi,
    mnemonic,
    infura_id,
    private_key_address_1,
    private_key_address_2,
    private_key_address_3,
    ethers,
    provider,
    deployerWallet,
    account1Wallet,
    account2Wallet,
    network,
    isDev,
    ContinousToken,
    GanacheDaiToken,
    daiAbi,
    expectEvent,
    expectRevert
}