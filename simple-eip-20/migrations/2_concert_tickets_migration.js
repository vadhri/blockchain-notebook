var ConcertTickets = artifacts.require("./ConcertTickets.sol");

module.exports = function(deployer) {
  deployer.deploy(ConcertTickets, 10000);
};
