const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();
const { INFURA_API_URL, MNEMONIC } = process.env;

module.exports = {
  networks: {
     development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
     goerli: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURA_API_URL),
      from: "0xd70D027A5DE01E9CEDB4fB725718D8E88441FC62",
      network_id: 5,       
      gas: 5500000  
    },     
    rinkeby: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURA_API_URL),
      network_id: 4,       
      from: "0x673e1e43357434551B52B58146Ae2586D543F104",
      gas: 5500000  
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.8.15",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
