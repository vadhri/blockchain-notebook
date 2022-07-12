pragma solidity >=0.4.25;

import "./SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    address private contractOwner;                                      
    bool private operational = true;                              
    mapping (address => bool) authorizedCallers;
    mapping (address => bool) airlines;
    address[] airlinesdump;

    constructor()  {
        contractOwner = msg.sender;
        operational= true;
        authorizedCallers[msg.sender] = true;
        airlines[msg.sender] = true;
        
        airlinesdump.push(msg.sender);
    }

    modifier requireIsOperational() {
        require(operational, "Contract is currently not operational");
        _; 
    }
    function toString(bytes memory data) public pure returns(string memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < data.length; i++) {
            str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    modifier authorizedCaller(address _caller) {
        string memory z = "Not an authorized caller.";
        string memory error = string(bytes.concat(bytes(z), bytes(toAsciiString(_caller))));

        require(authorizedCallers[_caller] == true, error);
        _;
    }

    modifier registeredAirline() {
        require(airlines[msg.sender] == true, "Not an authorized airline..");
        _;
    }

    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    function isOperational() public view returns(bool) {
        return operational;
    }

    function setOperatingStatus(bool mode) external requireContractOwner {
        operational = mode;
    }

    function isAirline(address addr) public view authorizedCaller(msg.sender) returns (bool) {
        return airlines[addr];
    }

    function addressDump() public view returns (address[] memory) {
        return airlinesdump;
    }
    
    function authorizeCaller(address _caller) public {
        authorizedCallers[_caller] = true;
    }

    function registerAirline(address addr, address from) public authorizedCaller(from) {
        airlines[addr] = true;
        authorizedCallers[addr] = true;
        airlinesdump.push(addr);
    }

    function buy() external payable {

    }

    function creditInsurees() external pure {
    }
    
    function pay() external pure {
    }

    function fund() public payable {
    }

    function getFlightKey(address airline, string memory flight, uint256 timestamp) pure internal returns(bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    receive() external payable {
        fund();
    }
}

