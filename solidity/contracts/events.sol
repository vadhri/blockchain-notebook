// SPDX-License-Identifier: MIT
pragma solidity >=0.4.9  <=0.9.0;

contract Bank {
    mapping(string => uint256) ledger;

    event Deposit (string account, uint256 amount);
    event WithDraw (string account, uint256 amount);

    function deposit(string memory account, uint256 amount) public returns (bool) {
        ledger[account] += amount;
        emit Deposit(account, amount);
        return true;
    }

    function withDraw(string memory account, uint256 amount) public returns (bool) {
        if (ledger[account] >= amount) {
            ledger[account] -= amount;
            emit WithDraw(account, amount);
            return true;
        }
        return false;
    }
    
    function getAccountBalance(string memory account) public view returns (uint256) {
        return ledger[account];
    }
}