const daiAddress = "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea";
const daiAbi = require('../scripts/abis/dai.json');
const { mnemonic, infura_id } = require('../secret.json');
const { ethers } = require('ethers');
const provider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${infura_id}`);
const wallet = new ethers.Wallet.fromMnemonic(mnemonic).connect(provider);
const daiContract = new ethers.Contract(daiAddress, daiAbi, provider).connect(wallet);
const ContinousToken = artifacts.require("ContinousToken");


contract("LinearCurveBondToken", async ([deployer, account1, account2]) => {

    const fiveDaiInWei = ethers.utils.parseEther("5");

    before(async () => {
        linearCurveBondToken = await ContinousToken.new(500000, daiAddress);    //1/2 * MAX_WEIGHT = 500000 RR
    });


    it("should cost 2 Dai for this purchase", async () => {

        //await daiContract.approve(linearCurveBondToken.address, fiveDaiInWei);
        //await linearCurveBondToken.mint(fiveDaiInWei);

        const price = await linearCurveBondToken.calculateContinuousMintReturn(100);

        console.log('Following:', ethers.utils.formatUnits(price));
      });
});
