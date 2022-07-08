const Sale = artifacts.require("Sale");
const serviceTax = artifacts.require("serviceTax");
const goodsTax = artifacts.require("goodsTax");
const stateTax = artifacts.require("stateTax");

contract("Sale", function (accounts) {
    let ct = null;

    it('add items and purchase', async function() {
        let saleInstance = await Sale.deployed();
        let serviceTaxInstance = await serviceTax.deployed();
        let goodsTaxInstance = await goodsTax.deployed();
        let stateInstance = await stateTax.deployed();
        
        ct = saleInstance;

        return ct.addItem(0, 1000).then(async receipt => {
            console.log("balance", accounts[0], await web3.eth.getBalance(accounts[0]));
            console.log("balance", accounts[2], await web3.eth.getBalance(accounts[2]));
            return ct.purchase(0, {from: accounts[2], value: 1000});
        }).then(ret => {
            return serviceTaxInstance.getBalance();
        }).then(balance => {
            console.log(balance.toNumber());
            return goodsTaxInstance.getBalance();
        }).then(balance => {
            console.log(balance.toNumber());
            return stateInstance.getBalance();
        }).then(async balance => {
            console.log(balance.toNumber());
            console.log("balance", accounts[0], await web3.eth.getBalance(accounts[0]));
            console.log("balance", accounts[2], await web3.eth.getBalance(accounts[2]));
        })
    });
});
