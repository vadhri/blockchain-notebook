const FlightStatus = artifacts.require("FlightStatus");

module.exports = function (deployer) {
    deployer.deploy(FlightStatus);
  };
  