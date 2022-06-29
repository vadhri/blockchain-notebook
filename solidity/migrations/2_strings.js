const Strings = artifacts.require("./strings");

module.exports = function (deployer) {
  deployer.deploy(Strings);
};
