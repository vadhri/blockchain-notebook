const ArtGallery = artifacts.require("ArtGallery");

contract("ArtGallery", function (accounts) {
    it('Add art to gallery', function () {
        return ArtGallery.deployed().then(instance => {
            ct = instance;
            return ct.addArt("Monalisa", 100, "Monalisa 001", {from: accounts[0]});
        }).then(receipt => {
            return ct.addArt("Monalisa", 100, "Monalisa 001", {from: accounts[1]});
        }).catch(error => {
            assert(error.message.indexOf("revert") >= 0, "Addition from non-admin accounts should be rejected.");
        })
    });

    it('Buy art', function () {
        return ArtGallery.deployed().then(instance => {
            ct = instance;
            return ct.addArt("Monalisa", 100, "Monalisa 001", {from: accounts[0]});
        }).then(receipt => {
            return ct.getArtItemByTokenId(0);
        }).then(info => {
            assert(info.name == "Monalisa" && info.price == '100');
            return ct.approveSale(accounts[1], 0);
        }).then(x => {
            return ct.buyArt(0, {from: accounts[1],  value: web3.utils.toWei("1", 'ether')});
        }).then(transfered => {
            console.log("transferred the asset.")
        })
    })
});