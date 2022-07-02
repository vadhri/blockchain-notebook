const notary = artifacts.require('StarNotary');

contract("StarNotary", function (accounts) {
    it('check star name', function () {
        return notary.deployed().then(instance => {
            ct = instance;
            return ct.starName.call();
        }).then (name => {
            assert(name == "North star", "Star name is incorrect !")
        })
    })
    it('check star name', function () {
        return notary.deployed().then(instance => {
            ct = instance;
            return ct.claimStar();
        }).then(reecipt => {
            return ct.starOwner.call();
        }).then(starOwner => {
            assert(starOwner == accounts[0], "owner incorrect");
            return ct.claimStar({from: accounts[1]});
        }).then(receipt => {
            return ct.starOwner.call();
        }).then (owner => {
            assert(owner == accounts[1], "owner incorrect");
        })
    })
});