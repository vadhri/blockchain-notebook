const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  compilers: {
    solc: {
      version: "0.8.15",
    },
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      websockets: true
    },  
    goerli: {
      provider: () =>
        new HDWalletProvider({
          privateKeys: ["******"],
          providerOrUrl:
            'wss://goerli.infura.io/ws/v3/******',
          addressIndex: 0
        }),      
      network_id: 5,       
      gas: 5500000,         
      confirmations: 2,    // # of confirmations to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: false,     // Skip dry run before migrations? (default: false for public nets )
      from: "******"
    },
  }
};