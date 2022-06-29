const SolarSystem = artifacts.require("SolarSystem");

module.exports = function (deployer) {
  deployer.deploy(SolarSystem);
};
