// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ConcertTickets {
    uint256 public totalSupply;
    string public name = "MyToken";
    string public symbol = "MT";

    mapping (address => uint256) public balanceOf;
    mapping (address => mapping(address => uint256)) public allowances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = totalSupply;
    }

    // Transfers _value amount of tokens to address _to, and MUST fire the Transfer event. 
    // The function SHOULD throw if the message caller’s account balance does not have enough tokens to spend.
    // Note Transfers of 0 values MUST be treated as normal transfers and fire the Transfer event.

    // transfer tokens 
    function transfer (address _to, uint256 value) public returns (bool success) {
        require(balanceOf[msg.sender] >= value, "not enough balance, revert gasleft");
        balanceOf[msg.sender] -= value;
        balanceOf[_to] += value;

        emit Transfer(msg.sender, _to, value);
        return true;
    }

    // Returns the amount which _spender is still allowed to withdraw from _owner.
    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowances[_owner][_spender];
    }

    // The transferFrom method is used for a withdraw workflow, allowing contracts to transfer tokens on your behalf. 
    // This can be used for example to allow a contract to transfer tokens on your behalf and/or to charge fees in sub-currencies. 
    // The function SHOULD throw unless the _from account has deliberately authorized the sender of the message via some mechanism.
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from], "not enough balance, revert gasleft");
        require(_value <= allowances[_from][msg.sender], "not enough approved balance, revert" );
        balanceOf[_from] -= _value;
        allowances[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
}