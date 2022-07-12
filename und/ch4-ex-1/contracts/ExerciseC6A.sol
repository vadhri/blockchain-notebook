// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25;

contract ExerciseC6A {
    struct UserProfile {
        bool isRegistered;
        bool isAdmin;
    }

    address private contractOwner;                  // Account used to deploy contract
    mapping(address => UserProfile) userProfiles;   // Mapping for storing user profiles
    bool private isOperational;
 
    constructor() {
        contractOwner = msg.sender;
    }

    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier requireOperational() {
        require(isOperational == true);
        _;
    }

    function isUserRegistered(address account) external view returns(bool)
    {
        require(account != address(0), "'account' must be a valid address.");
        return userProfiles[account].isRegistered;
    }

    function registerUser(address account,bool isAdmin) external requireContractOwner requireOperational
    {
        require(!userProfiles[account].isRegistered, "User is already registered.");
        userProfiles[account] = UserProfile({isRegistered: true, isAdmin: isAdmin });
    }

    function setOperational(bool operational) public requireContractOwner {
        isOperational = operational;
    }
}

