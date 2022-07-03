// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract DonorWallet {
    Charity _contract;

    function donateFunds(address charityAddress, uint256 amount) public payable {
        _contract = Charity(charityAddress);
        _contract.receiveFunds{value: msg.value}(amount);
    }
}

contract Charity { 
    uint256 public funds;
    mapping(address => uint256) public donationsLedger;

    function receiveFunds(uint256 amount ) external payable {
        require(amount <= msg.value);
        funds += amount;
        donationsLedger[msg.sender] = amount;
    }

    function getFundingByMe() public view returns (uint256) {
        return donationsLedger[msg.sender];
    }
}

