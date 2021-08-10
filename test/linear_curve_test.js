const {
  daiAddress,
  ethers,
  deployerWallet,
  account1Wallet,
  account2Wallet,
  ContinousToken,
  GanacheDaiToken,
  provider,
  daiAbi,
  isDev
} = require('../scripts/helpers/common');

contract("LinearCurveBondToken", async ([deployer, account1, account2]) => {

  let linearCurveBondToken, linearCurveBondTokenAddress, ganacheDaiToken, daiAddress;

  const fiveEtherInWei = ethers.utils.parseEther("5");

  before(async () => {
     ganacheDaiToken = await GanacheDaiToken.new([deployerWallet.address, account1Wallet.address, account2Wallet.address]);
     daiAddress = isDev ? ganacheDaiToken.address : "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea";
    
    linearCurveBondToken = await ContinousToken.new(500000, daiAddress);    //1/2 * MAX_WEIGHT = 500000 RR
    linearCurveBondTokenAddress = linearCurveBondToken.address;
  });

  it("should verify quantity nMunis1 is greater than quantity n and quantity n+1 is less than quantity n", async () => {

    const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
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