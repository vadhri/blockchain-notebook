var Borrow = artifacts.require("./Borrow.sol");

module.exports = function(deployer) {
  deployer.deploy(Borrow);
};
