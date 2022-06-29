var srxtx = artifacts.require("./StructRxTx");

contract("StructRxTx", function (accounts) {
    let ct = null;
    
    it("initialize the structs", function() {
        return srxtx.deployed().then(instance => {
            ct = instance;
            return ct.registerTransaction(web3.utils.fromUtf8("123456789"), accounts[0], accounts[1], 122);
        }).then(receipt => {
            return ct.registerTransaction.call(web3.utils.fromUtf8("123456789"), accounts[0], accounts[1], 122);
        }).then(result => {
            assert(result == false, "Transaction should not be accepted");
            return ct.getTransaction.call(web3.utils.fromUtf8("123456789"));
        }).then(result => {
            assert(result.value == 122, "Transaction is not correct one");
        })
    });
})