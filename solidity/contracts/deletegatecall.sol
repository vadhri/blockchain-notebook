// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract country {
    uint256 public salesTaxPercent = 0; 
    function makeSale(uint256 amount) public {
        salesTaxPercent = amount;
    }
}

contract saleDeed {
    uint256 public salesTaxPercent = 0;

    function makeSale(address contractAddress, uint256 amount) public {
        contractAddress.delegatecall(
            abi.encodeWithSignature("makeSale(uint256)", amount)
        );
    }
}