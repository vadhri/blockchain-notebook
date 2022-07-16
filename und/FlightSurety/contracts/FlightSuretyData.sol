pragma solidity >=0.4.25;

import "./SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    struct airline {
        uint256 funds;
        bool isregistered;
    }

    struct passengerinfo {
        uint256 insurance_bought;
        uint256 creditedInsurance;
    }

    struct passenger {
        mapping (string => passengerinfo) iten;
        string[] flightList; 
    }

    address private contractOwner;                                      
    bool private operational = true;       

    mapping (address => bool) authorizedCallers;

    mapping (address => airline) airlines;
    mapping (string => address) flightAndAirlineList;
    mapping (string => address[]) flightAndPassengerList; 
    
    mapping (address => string[]) airlineToFlight;
    mapping (address => passenger) passengerList;

    address[] airlinesdump;

    constructor()  {
        contractOwner = msg.sender;
        operational= true;
        authorizedCallers[msg.sender] = true;
        airlines[msg.sender] = airline(0, true);
        
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
        require(airlines[msg.sender].isregistered == true, "Not an authorized airline..");
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
        return airlines[addr].isregistered;
    }

    function addressDump() public view returns (address[] memory) {
        return airlinesdump;
    }
    
    function flightDump(address _airline) public view returns (string[] memory) {
        return airlineToFlight[_airline];
    }

    function authorizeCaller(address _caller) public {
        authorizedCallers[_caller] = true;
    }

    function registerAirline(address addr, address from) public authorizedCaller(from) {
        airlines[addr] = airline(0, true);
        authorizedCallers[addr] = true;
        airlinesdump.push(addr);
    }
    event InsuranceBought(uint256, uint256);

    function buyInsurance(string memory flight, address _passenger, uint256 _insuredAmount) public payable {
        passengerList[_passenger].iten[flight].insurance_bought = _insuredAmount;
        passengerList[_passenger].flightList.push(flight);
        flightAndPassengerList[flight].push(_passenger);
        emit InsuranceBought(_insuredAmount, address(this).balance);
    }

    function isInsured(string memory flight, address _passenger) public view returns (bool) {
        return passengerList[_passenger].iten[flight].insurance_bought > 0;
    }

    function insuredAmount(string memory flight, address _passenger) public view returns (uint256) {
        return passengerList[_passenger].iten[flight].insurance_bought;
    }

    function registerFlight(address _airline, string memory flightName) public {
        flightAndAirlineList[flightName] = _airline;
        airlineToFlight[_airline].push(flightName);
    }

    function isRegisteredFlight(string memory flight) public view returns (bool) {
        if (flightAndAirlineList[flight] == address(0)) {
            return false;
        } else {
            return true;
        }
    }

    event BalanceChangeNotification(address, string, uint256, uint256);

    function creditInsurees(address _airline, string memory flight) public {
        for (uint256 i = 0; i < flightAndPassengerList[flight].length; i++ ) {
            address _passenger = flightAndPassengerList[flight][i];
            passengerList[_passenger].iten[flight].creditedInsurance += passengerList[_passenger].iten[flight].insurance_bought * 3 / 2;
            emit BalanceChangeNotification(_passenger, flight, passengerList[_passenger].iten[flight].insurance_bought, passengerList[_passenger].iten[flight].creditedInsurance);
            passengerList[_passenger].iten[flight].insurance_bought = 0;
        }
    }
    
    event FundsTransferred(address, uint256, uint256);
    
    function withdraw(address _passenger) public payable returns (uint256) {
        uint256 totalMoney = 0;

        for (uint256 i = 0; i < passengerList[_passenger].flightList.length; i++) {
            uint256 money = passengerList[_passenger].iten[passengerList[_passenger].flightList[i]].creditedInsurance;
            if (money > 0) {
                totalMoney += money;
            }
            passengerList[_passenger].iten[passengerList[_passenger].flightList[i]].creditedInsurance = 0;
        }

        payable(_passenger).transfer(totalMoney);
        emit FundsTransferred(_passenger, totalMoney, address(_passenger).balance);
        return totalMoney;
    }
    
    function fund(address _airline, uint256 value) public payable {
        airlines[_airline].funds += value;
        emit FundsTransferred(_airline, value, address(this).balance);
    }

    function getPassengerBalanceByFlightName(address _passenger, string memory flightName) public returns (uint256) {
        emit BalanceChangeNotification(_passenger, flightName, passengerList[_passenger].iten[flightName].insurance_bought, passengerList[_passenger].iten[flightName].creditedInsurance);
        return passengerList[_passenger].iten[flightName].creditedInsurance;
    }

    function getFlightKey(address _airline, string memory flight, uint256 timestamp) pure internal returns(bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    receive() external payable {
        
    }
}

