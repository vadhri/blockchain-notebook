const mp = artifacts.require("MarketPlace");

module.exports = function (deployer) {
    deployer.deploy(mp);
}