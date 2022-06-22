const web3 = require('web3');
let EthereumTransaction = require('ethereumjs-tx').Transaction;
let pvt_key = process.argv[2];

let web3_infura = new web3("HTTP://127.0.0.1:7545");

let sending_addr = "0x700D36942c5C9C0Af737bD68d499c974e5c27B1f";
let recv_addr = "0x66d4B706381809ae3f6F30C2e1FB47EE7091a304";

web3_infura.eth.getAccounts().then(accounts => {
    accounts.forEach(acc => {
        web3_infura.eth.getBalance(acc).then(b => {
            console.log("account : ", acc, "balance = ", b)
        })
    })
});

let raw_transaction = {
    nonce: 2,
    to: recv_addr,
    gasPrice: 20000000,
    gasLimit: 30000,
    value: 1000000000,
    data: "0x"
};

// sign transaction with private key of sender. 
let pvt_key_buffer = Buffer.from(pvt_key, 'hex');

let transaction = new EthereumTransaction(raw_transaction);
transaction.sign(pvt_key_buffer);

var serializedTransaction = transaction.serialize(); 
web3_infura.eth.sendSignedTransaction(serializedTransaction);
