const {
  ethers,
  deployerWallet,
  account1Wallet,
  account2Wallet,
  ContinousToken,
  GanacheDaiToken,
  provider,
  daiAbi,
  expectEvent,
  expectRevert,
  isDev
} = require('../scripts/helpers/common');

contract("LinearCurveBondToken", async ([deployer, account1, account2]) => {

  let 
  linearCurveBondToken,
  linearCurveBondTokenAddress, 
  ganacheDaiToken, 
  daiAddress, 
  daiContract;

  const fiveEtherInWei = ethers.utils.parseEther("5");

  before(async () => {
    ganacheDaiToken = await GanacheDaiToken.new([deployerWallet.address, account1Wallet.address, account2Wallet.address]);
    daiAddress = isDev ? ganacheDaiToken.address : "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea";
    daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
    linearCurveBondToken = await ContinousToken.new(500000, daiAddress);          //1/2 * MAX_WEIGHT = 500000 RR
    linearCurveBondTokenAddress = linearCurveBondToken.address;
  });

  it("deployer should hold current total 1 token", async () => {
    const tokTotal = await linearCurveBondToken.totalSupply();
    const deployerBal = await linearCurveBondToken.balanceOf(deployer);

    assert.equal(true, tokTotal.eq(deployerBal), "Deployer does not hold current total token");
  });

  it("publishes event when token is minted", async () => {

    await daiContract
    .connect(deployerWallet)
    .approve(linearCurveBondTokenAddress, fiveEtherInWei);

    const amount = await linearCurveBondToken.calculateContinuousMintReturn(
      fiveEtherInWei
    );

    const _e = await linearCurveBondToken.mint(fiveEtherInWei, {
      from: deployer,
    });

    expectEvent(_e, 'ContinuousMint', { _address: deployer, reserveTokenAmount: fiveEtherInWei.toString(), continuousTokenAmount: amount.toString() });
  })

  it("publishes event when token is burnt", async () => {

    const balance = await linearCurveBondToken.balanceOf(deployer);

    //Since BN and BigNumber don't cooperate well,
    //Convert back to BigNumber to perform sub operations
    const balMinusDefault = ethers.utils.parseUnits(balance.toString(),'wei').sub(ethers.utils.parseEther('1'));   //Minus the default one assigned to deployer

    const currentPrice = await linearCurveBondToken.calculateContinuousBurnReturn(balMinusDefault);

    const _e = await linearCurveBondToken.burn(balMinusDefault, {
      from: deployer,
    });

    expectEvent(_e, 'ContinuousBurn', { _address: deployer, continuousTokenAmount: balMinusDefault.toString(), reserveTokenAmount: currentPrice.toString() });
  })

  it("should revert if no reserveToken was approved", async () => {
    await expectRevert(
      linearCurveBondToken.mint(fiveEtherInWei, {from: account2}),
      "Must approve DAI to buy tokens."
    );
  });

  it("burn: should verify burning of TOK tokens drops price back correctly", async () => {

    const nRate = await linearCurveBondToken.calculateContinuousMintReturn(
      fiveEtherInWei
    );

    //Account 1 buys some TOK tokens with 5 Dai
    await daiContract
      .connect(account1Wallet)
      .approve(linearCurveBondTokenAddress, fiveEtherInWei);

    await linearCurveBondToken.mint(fiveEtherInWei, {
      from: account1,
    });

    const nPlus1Rate = await linearCurveBondToken.calculateContinuousMintReturn(
      fiveEtherInWei
    );

    //Account 2 buys some TOK tokens with 5 DAI
    await daiContract
      .connect(account2Wallet)
      .approve(linearCurveBondTokenAddress, fiveEtherInWei);
    
    await linearCurveBondToken.mint(fiveEtherInWei, {
      from: account2,
    });

    const balance = await linearCurveBondToken.balanceOf(account2);

    //Calculate new burn return (Dai)
    const nMinus1Rate = await linearCurveBondToken.calculateContinuousBurnReturn(balance);

    assert.equal(true, fiveEtherInWei.gt(ethers.utils.parseUnits(nMinus1Rate.toString(),'wei')), "get less Dai for token sales due to price drop");
  });


  it("mint: should verify quantity nMunis1 is greater than quantity n and quantity n+1 is less than quantity n", async () => {

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