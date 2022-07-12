// SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0;

contract MultiParty {
    bool public isOperational;
    uint256 ledgerRequest;
    uint concensusLimit = 3;

    mapping(uint256 => ledgerRequestStatus) concensusLedger;
    mapping(address => bool) admins;
    
    struct ledgerRequestStatus {
        address[] signedBy;
        bool active; 
    }

    constructor() {
        isOperational = true;
        ledgerRequest = 0;
        admins[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender]);
        _;
    }

    modifier needsOperational {
        require(isOperational);
        _;
    }

    function initContractStatusChange() onlyAdmin public returns (uint256) {
        ledgerRequest += 1;

        address [] memory ref;
        concensusLedger[ledgerRequest] = ledgerRequestStatus(ref, true);
        concensusLedger[ledgerRequest].signedBy.push(msg.sender);

        return ledgerRequest;
    }

    function signConsent(uint256 requestId) onlyAdmin public returns (uint256) {
        require(concensusLedger[requestId].active == true);
        address[] memory existingConcensusForRequest = concensusLedger[requestId].signedBy;
        for (uint256 i = 0; i < existingConcensusForRequest.length; i++) {
            require (existingConcensusForRequest[i] != msg.sender);
        }
        concensusLedger[requestId].signedBy.push(msg.sender);
        if (concensusLedger[requestId].signedBy.length == concensusLimit) {
            concensusLedger[requestId].active = false;
            setOperational(isOperational ? false : true);
        }
        return concensusLedger[requestId].signedBy.length;
    }

    function setOperational(bool _operational) onlyAdmin internal {
        isOperational = _operational;
    }

    function addAdmin(address newAdmin) onlyAdmin public {
        admins[newAdmin] = true;
    } 
}