const daiAddress = "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea";
const daiAbi = require('../scripts/abis/dai.json');
const { mnemonic, infura_id } = require('../secret.json');
const { ethers } = require('ethers');
const provider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${infura_id}`);
const wallet = new ethers.Wallet.fromMnemonic(mnemonic).connect(provider);
const daiContract = new ethers.Contract(daiAddress, daiAbi, provider).connect(wallet);
const ContinousToken = artifacts.require("ContinousToken");


contract("ContinousToken", async ([deployer, account1, account2]) => {

   

});
