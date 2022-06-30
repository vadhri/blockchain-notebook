// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Modifiers {
    uint256 public minBiddingAmount;

    modifier higherBidsOnly(uint256 value) {
        if (value > minBiddingAmount) {
            _;
        } else {
            revert();
        }
    }

    function setMinBiddingAmount(uint256 value) higherBidsOnly(value) public returns (bool res) {
        minBiddingAmount = value;
        return true;
    } 
}