// SPDX-License-Identifier: MIT
pragma solidity >=0.4.10 <= 0.9.0;

contract StructRxTx {
    struct Transaction {
        bytes32 id;
        address to;
        address from;
        uint256 value;
        bool registered;
    }

    mapping(bytes32 => Transaction) txregister;

    function registerTransaction(bytes32 id, address to, address from, uint256 value) public returns (bool){
        Transaction memory txobj;
        
        if (txregister[id].registered) {
            return false;
        }

        txobj.id = id;
        txobj.to = to;
        txobj.from = from;
        txobj.value = value;
        txobj.registered = true;

        txregister[id] = txobj;
        
        return txregister[id].registered;
    }

    function getTransaction(bytes32 id) public view returns (Transaction memory) {
        Transaction memory txobj;
        
        txobj.id = txregister[id].id;
        txobj.to = txregister[id].to;
        txobj.from = txregister[id].from;
        txobj.value = txregister[id].value;
        txobj.registered = true;

        return txobj;
    }

}