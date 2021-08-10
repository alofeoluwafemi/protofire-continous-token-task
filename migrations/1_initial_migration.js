const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  process.env.NETWORK = deployer.network;
  deployer.deploy(Migrations);
};
