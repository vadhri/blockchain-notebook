const emp = artifacts.require("Employee");
const empapp = artifacts.require("EmployeeApp");

contract("EmployeeApp", function (accounts) {
    it('Test app and data contracts', () => {
        let empi = null;
        let empappi = null;
        return empapp.deployed().then(async instance => {
            empappi = await emp.deployed();
            empi = instance;
            console.log(accounts[0]);
            return empappi.registerEmployee("Account1", false, accounts[1], {from: accounts[0]});
        }).then(rec => {
            console.log(rec.receipt.blockNumber);
            return empi.addSale("Account1", 1000,  {from: accounts[0]});
        }).then(r => {
            console.log(r.receipt.blockNumber);
        })
    });
})