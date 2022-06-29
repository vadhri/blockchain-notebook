// SPDX-License-Identifier: MIT
pragma solidity >=0.4.9  <=0.9.0;

contract array {
    string[] dynamicStorageArray;
    mapping(string => uint256) store;

    function getArray() public view returns (string[] memory) {
        return dynamicStorageArray;
    } 
    
    function additem(string memory item) public returns (bool result) {
        require(bytes(item).length <= 10);

        dynamicStorageArray.push(item);
        store[item] = bytes(item).length;

        return true;
    } 
}
