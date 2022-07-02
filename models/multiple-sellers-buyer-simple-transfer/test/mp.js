const MarketPlace = artifacts.require("MarketPlace");

contract("MarketPlace", function (accounts) {
    let ct = null;
    it("Check add item", function () {
        return MarketPlace.deployed().then(instance => {
            ct = instance;
            return ct.addItem(0, "Football Inc", 1000000, 10, {from: accounts[0]});
        }).then(receipt => {
            return ct.addItem(0, "Football Inc", 1000000, 10, {from: accounts[1]});
        }).then(receipt => {
            return ct.addItem(0, "Football Inc", 1000000, 10, {from: accounts[2]});
        }).then(receipt => {
            return ct.getAllStockByItem(0);
        }).then(async r => {
            assert(r == 30, "Quantity is incorrect");
            return ct.buyItemForAnyPrice(0, 30, {from: accounts[3], value: 30000000})
        }).then(function(r) {
            return ct.getAllStockByItem(0, {from: accounts[3]});
        }).then(async r => {
            assert(r == 0, "Quantity is incorrect");  
        })
    });
});