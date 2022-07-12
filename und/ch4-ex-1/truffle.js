var HDWalletProvider = require("truffle-hdwallet-provider");

// Be sure to match this mnemonic with that in Ganache!
var mnemonic = "rough spirit oxygen tape already super leave illness delay midnight credit cash";

module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:7545/", 0, 10);
      },
      network_id: '*',
    }
  }
};