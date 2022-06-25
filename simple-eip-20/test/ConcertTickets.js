var ConcertTickets = artifacts.require('./ConcertTickets');
let owner = null;
let to = null;
let delegate = null;

contract('ConcertTickets', function(accounts) {
    var ct;
    it('initialize contract', function() {
        return ConcertTickets.deployed().then(instance => {
            ct = instance;
            return ct.name();
        }).then(function (name) {
            assert.equal(name, "MyToken", 'name is not correct! ')
            return ct.symbol();
        }).then(symbol => {
            assert.equal(symbol, "MT", 'symbol is not correct !')
        })
    })
    it ('set total supply', function() {
        return ConcertTickets.deployed().then(instance => {
            ct = instance;
            return ct.totalSupply();
        }).then(function (ts) {
            assert.equal(ts.toNumber(), 10000, 'totalTickets are wrong')
            return ct.balanceOf(accounts[0]);
        }).then(adminBalance => {
            assert.equal(adminBalance.toNumber(), 10000, 'allocated value is wrong !')
        })
    })
    it('transfer test', function () {
        let current_balance = 0;

        return ConcertTickets.deployed().then(instance => {
           ct = instance;
           return ct.transfer.call(accounts[1], 9999999999)
        }).then(assert.fail).catch(error => {
            assert(error.message.indexOf('revert') >= 0, 'Error message must say revert.')
            return ct.balanceOf(accounts[1])
        }).then(start_balance => {
            current_balance = start_balance;
            return ct.transfer(accounts[1], 25, {from: accounts[0]});
        }).then(receipt => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be a transfer event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'Transfer happened from account 0');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'Transfer was sent to account 1');
            assert.equal(receipt.logs[0].args._value, 25, 'Transfer was sent to account 1');

            return ct.balanceOf(accounts[1]);
        }).then(balance => {
            assert.equal(balance.toNumber(),current_balance + 25)
        })
    })

    it('Approves tokens for delegated transfer !', function() {
        return ConcertTickets.deployed().then(instance => {
            ct = instance;
            return ct.approve.call(accounts[1], 25);
        }).then(success => {
            assert.equal(success,true, 'returns true for success')
            return ct.approve(accounts[1], 25);
        }).then(receipt => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            
            assert.equal(receipt.logs[0].event, 'Approval', 'should be a transfer event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'Transfer happened from account 0');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'Transfer was sent to account 1');
            assert.equal(receipt.logs[0].args._value, 25, 'Transfer was sent to account 1');
            return ct.allowance(accounts[0], accounts[1]);
        }).then(allowance => {
            assert.equal(allowance, 25, 'Allowance approved.')
        })
    })

    it('delegated transfers', function() {
        return ConcertTickets.deployed().then(instance => {
            ct = instance;

            delegate = accounts[0];
            owner = accounts[2];
            to = accounts[3];

            return ct.transfer(owner, 20, {from: accounts[0]})
        }).then(receipt => {
            return ct.approve(delegate, 10, {from: owner})
        }).then(receipt => {
            return ct.transferFrom(owner, to, 9999, { from: delegate });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'not enough balance.')
            return ct.transferFrom(owner, to, 20, { from: delegate });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'Value > approved amount')
            return ct.transferFrom(owner, to, 5, { from: delegate });
        }).then(receipt => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be a transfer event');
            assert.equal(receipt.logs[0].args._from, owner, 'Transfer happened from account 0');
            assert.equal(receipt.logs[0].args._to, to, 'Transfer was sent to account 1');
            assert.equal(receipt.logs[0].args._value, 5, 'Transfer was sent to account 1');                
        })
    })
})