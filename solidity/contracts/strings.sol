// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <=0.9.0;

contract Strings {
    string name = "This is testing";

    function getNameValue() public view returns(string memory) {
        return name;
    }

    function setNameValue(string memory _name) public returns (bool success) {
        bytes memory x = bytes(_name);  
        require(x[0] >= 0x41 && x[0] <= 0x5a);
        name = _name;
        return true;
    }
}