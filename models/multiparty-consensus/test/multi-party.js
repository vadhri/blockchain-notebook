const MultiParty = artifacts.require("MultiParty");
let mp = null;

contract("Multiparty", function (accounts) {
    it('Add admins and start consensus', async function (){
        mp = await MultiParty.deployed();
        await mp.addAdmin(accounts[1]);
        await mp.addAdmin(accounts[2]);
        await mp.initContractStatusChange();
        await mp.signConsent(1, {from: accounts[1]});
        await mp.signConsent(1, {from: accounts[2]});
        let ret = await mp.isOperational();
        assert(ret == false);
    })
})