 var MyCoin = artifacts.require("./MyCoin.sol");

module.exports = function(deployer) {
   deployer.deploy(MyCoin, 1000000000);
};
