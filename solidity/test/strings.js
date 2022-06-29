var strings = artifacts.require('./strings');

contract("strings", function(accounts) {
    var ct;

    it('initialize contract', function() {
        return strings.deployed().then(instance => {
            ct = instance;
            return ct.getNameValue();
        }).then(function (name) {
            assert.equal(name, "This is testing", 'name is not correct! ')
        })
    })
    
    it('check set name', function () {
        return strings.deployed().then(instance => {
            ct = instance;
            return ct.setNameValue("Testing")
        }).then(receipt => {
            return ct.getNameValue();
        }).then(name => {
            assert.equal(name, "Testing")
        })
    })

    it ('check set name error', function () {
        return strings.deployed().then(instance => {
            ct = instance;
            return ct.setNameValue('Testing');
        }).catch(error => {
            assert(error.message.indexOf("revert") >= 0, "Expected revert to happen on string")
        })
    })
});

