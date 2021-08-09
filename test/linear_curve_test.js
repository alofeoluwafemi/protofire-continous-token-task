const daiAddress = "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea";
const daiAbi = require("../scripts/abis/dai.json");
const {
  mnemonic,
  infura_id,
  private_key_address_1,
  private_key_address_2,
  private_key_address_3,
} = require("../secret.json");
const { ethers } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(
  `https://rinkeby.infura.io/v3/${infura_id}`
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
const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
const ContinousToken = artifacts.require("ContinousToken");

contract("LinearCurveBondToken", async ([deployer, account1, account2]) => {
  let linearCurveBondToken, linearCurveBondTokenAddress;

  const fiveEtherInWei = ethers.utils.parseEther("5");

  before(async () => {
    linearCurveBondToken = await ContinousToken.at(
      "0xb866e00d93193798d44b5eb1a164d9e809fcfec5"
    );
    //linearCurveBondToken = await ContinousToken.new(500000, daiAddress);    //1/2 * MAX_WEIGHT = 500000 RR
    linearCurveBondTokenAddress = linearCurveBondToken.address;
  });

  it("should verify quantity nMunis1 is greater than quantity n and quantity n+1 is less than quantity n", async () => {
    const nMinus1 = await linearCurveBondToken.calculateContinuousMintReturn(
      fiveEtherInWei
    );

    //Account 1 buys some TOK tokens with 5 Dai
    await daiContract
      .connect(account1Wallet)
      .approve(linearCurveBondTokenAddress, fiveEtherInWei);

    await linearCurveBondToken.mint(fiveEtherInWei, {
      from: account1,
    });

    const n = await linearCurveBondToken.calculateContinuousMintReturn(
      fiveEtherInWei
    );

    //Account 2 buys some TOK tokens with 5 Dai
    await daiContract
    .connect(account2Wallet)
    .approve(linearCurveBondTokenAddress, fiveEtherInWei);

    await linearCurveBondToken.mint(fiveEtherInWei,{
        from: account2
    });

    const nPlus1 = await linearCurveBondToken.calculateContinuousMintReturn(fiveEtherInWei);


    assert.equal(true, nMinus1.gt(n), "quantity nMunis1 is not greater than quantity n");
    assert.equal(true, nPlus1.lt(n), "quantity nPlus1 is not less than quantity n");
  });
});