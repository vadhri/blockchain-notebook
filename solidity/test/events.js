const Bank = artifacts.require("Bank");

contract("Bank", function (accounts) {
    let ct = null;

    it("withdraw & deposit", function() {
        return Bank.deployed().then(instance => {
            ct = instance;
            return ct.deposit("test", 1000);
        }).then(receipt => {
            return ct.getAccountBalance("test");
        }).then(balance => {
            assert(balance == 1000, "Mis-match of the balance");
            return ct.withDraw("test", 100);
        }).then(receipt => {
            return ct.getAccountBalance("test");
        }).then(balance => {
            assert(balance == 900, "Mis-match of the balance");
        })
    });
})