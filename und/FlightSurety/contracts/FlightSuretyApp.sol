// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25;

import "./SafeMath.sol";
import "./FlightSuretyData.sol";

contract FlightSuretyApp {
    using SafeMath for uint256; 
    FlightSuretyData d;
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;
    
    uint256 private constant MAX_INSURANCE_AMOUNT = 1 ether;

    address private contractOwner;          
    bool public operational  = false;
    uint256 public oracleRegisterFee = 20000;
    uint256 airlineCount = 0;
    mapping(address => address[]) airlineRegistrationVotes;
    
    struct Flight {
        bool isRegistered;
        uint8 statusCode;
        uint256 updatedTimestamp;        
        address airline;
    }

    event AirlineRegistered(address);
    event AirlineAlreadyRegistered(address);
    event AirlineVoted(address, uint256);
    
    mapping(bytes32 => Flight) private flights;

    modifier requireOperational() {
        require(operational == true, "Contract is currently not operational");  
        _; 
    }

    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    constructor(address data) {
        contractOwner = msg.sender;
        d = FlightSuretyData(payable(data));
        d.authorizeCaller(msg.sender);
        airlineCount = 1;
        operational = true;
    }

    function isOperational() public view returns(bool) {
        return operational;  // Modify to call data contract's status
    }

    function getRegistrationFeeForOracle() public view returns (uint256) {
        return oracleRegisterFee;
    }

    function ceil(uint a) public pure returns (uint ) {
        if (a%2 == 0) {
            return a/2;
        } else {
            return (a+1)/2;
        }
    }

    function isRegisteredAirline(address airline) public view returns (bool) {
        return d.isAirline(airline);
    }
    
    function registerAirline(address airline) public requireOperational returns(bool success, uint256 votes)  {
        require(d.isAirline(msg.sender), "Caller should be a registered airline");

        // check if the registration request is for an airline that already is registered.
        if (d.isAirline(airline) == true) {
            emit AirlineAlreadyRegistered(airline);
            return (true, airlineCount);
        }

        // if total airline count is < 4, no voting is necessary. register airline.
        if (airlineCount < 4) {    
            d.registerAirline(airline, msg.sender);
            airlineCount += 1;
            emit AirlineRegistered(airline);
            return (true, 1);
        } 

        for (uint i=0; i < airlineRegistrationVotes[airline].length; i++) {
            if (airlineRegistrationVotes[airline][i] == msg.sender) {
                return (false, airlineRegistrationVotes[airline].length);
            } 
        }

        airlineRegistrationVotes[airline].push(msg.sender);

        
        if ( airlineRegistrationVotes[airline].length == ceil(airlineCount)) {
            d.registerAirline(airline, msg.sender);
            airlineCount += 1;
            emit AirlineRegistered(airline);
            return (true,  airlineRegistrationVotes[airline].length);
        } else {
            emit AirlineVoted(airline, airlineRegistrationVotes[airline].length);
            return (false,  airlineRegistrationVotes[airline].length);
        }
    }

    function fundAirline() payable external requireOperational {
        require(isRegisteredAirline(msg.sender), "The Airline to be funded is not registered");
        d.fund(msg.sender, msg.value);
        payable(address(d)).transfer(msg.value);
    }

    function buyInsurance(string memory flight) external payable requireOperational {
        require(msg.value <= 1 ether, "Funds greater than allowed amount, 1 ether");
        require(d.isRegisteredFlight(flight), "The flight to be funded is not registered");
        payable(address(d)).transfer(msg.value);
        d.buyInsurance(flight, msg.sender, msg.value);
    } 

    function getPassengerBalance(string memory flightName) public requireOperational returns (uint256) {
        return d.getPassengerBalanceByFlightName(msg.sender, flightName);
    }

    function withDraw() public payable requireOperational returns (uint256) {
        return d.withdraw(msg.sender);
    }

    function airlineVotes(address airline) public view returns (address[] memory) {
        return airlineRegistrationVotes[airline];
    }

    // only registered airlines can register their own flights
    function registerFlights(string[] memory flightNumber) public requireOperational {
        require(isRegisteredAirline(msg.sender), "Not a registered airline");
        for (uint i = 0; i < flightNumber.length; i++) {
            d.registerFlight(msg.sender, flightNumber[i]);
        }
    }
    event creditInsureesNotification(address, string);

    function processFlightStatus(address airline, string memory flight, uint256 timestamp, uint8 statusCode) requireOperational internal {
        if (statusCode == STATUS_CODE_LATE_AIRLINE) {
            emit creditInsureesNotification(airline, flight);

            d.creditInsurees(airline, flight);
        }
    }

    function fetchFlightStatus (address airline, string memory flight, uint256 timestamp) external {
        uint8 index = getRandomIndex(msg.sender);

        // Generate a unique key for storing the request
        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));

        ResponseInfo storage r = oracleResponses[key];
        r.requester = msg.sender;
        r.isOpen = true;

        emit OracleRequest(index, airline, flight, timestamp);
    } 


// region ORACLE MANAGEMENT

    // Incremented to add pseudo-randomness at various points
    uint8 private nonce = 0;    

    // Fee to be paid when registering oracle
    uint256 public constant REGISTRATION_FEE = 100;

    // Number of oracles that must respond for valid status
    uint256 private constant MIN_RESPONSES = 3;


    struct Oracle { 
        bool isRegistered;
        uint8[3] indexes;        
    }

    // Track all registered oracles
    mapping(address => Oracle) private oracles;

    // Model for responses from oracles
    struct ResponseInfo {
        address requester;                              // Account that requested status
        bool isOpen;                                    // If open, oracle responses are accepted
        mapping(uint8 => address[]) responses;          // Mapping key is the status code reported
                                                        // This lets us group responses and identify
                                                        // the response that majority of the oracles
    }

    // Track all oracle responses
    // Key = hash(index, flight, timestamp)
    mapping(bytes32 => ResponseInfo) private oracleResponses;

    // Event fired each time an oracle submits a response
    event FlightStatusInfo(address airline, string flight, uint256 timestamp, uint8 status);

    event OracleReport(address airline, string flight, uint256 timestamp, uint8 status);

    // Event fired when flight status request is submitted
    // Oracles track this and if they have a matching index
    // they fetch data and submit a response
    event OracleRequest(uint8 index, address airline, string flight, uint256 timestamp);


    // Register an oracle with the contract
    function registerOracle () external payable
    {
        // Require registration fee
        require(msg.value >= REGISTRATION_FEE, "Registration fee is required");
        uint8[3] memory indexes = generateIndexes(msg.sender);
        oracles[msg.sender] = Oracle({isRegistered: true, indexes: indexes});
    }

    function getMyIndexes() view external returns(uint8[3] memory)
    {
        require(oracles[msg.sender].isRegistered, "Not registered as an oracle");
        return oracles[msg.sender].indexes;
    }




    // Called by oracle when a response is available to an outstanding request
    // For the response to be accepted, there must be a pending request that is open
    // and matches one of the three Indexes randomly assigned to the oracle at the
    // time of registration (i.e. uninvited oracles are not welcome)
    function submitOracleResponse (
                            uint8 index,
                            address airline,
                            string memory flight,
                            uint256 timestamp,
                            uint8 statusCode
                        ) external {
        require((oracles[msg.sender].indexes[0] == index) || (oracles[msg.sender].indexes[1] == index) || (oracles[msg.sender].indexes[2] == index), "Index does not match oracle request");


        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp)); 
        require(oracleResponses[key].isOpen, "Flight or timestamp do not match oracle request");

        oracleResponses[key].responses[statusCode].push(msg.sender);

        // Information isn't considered verified until at least MIN_RESPONSES
        // oracles respond with the *** same *** information
        emit OracleReport(airline, flight, timestamp, statusCode);
        if (oracleResponses[key].responses[statusCode].length >= MIN_RESPONSES) {

            emit FlightStatusInfo(airline, flight, timestamp, statusCode);

            // Handle flight status as appropriate
            processFlightStatus(airline, flight, timestamp, statusCode);
        }
    }


    function getFlightKey(address airline, string memory flight,uint256 timestamp) pure internal returns(bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    // Returns array of three non-duplicating integers from 0-9
    function generateIndexes(address account) internal returns(uint8[3] memory) {
        uint8[3] memory indexes;
        indexes[0] = getRandomIndex(account);
        
        indexes[1] = indexes[0];
        while(indexes[1] == indexes[0]) {
            indexes[1] = getRandomIndex(account);
        }

        indexes[2] = indexes[1];
        while((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
            indexes[2] = getRandomIndex(account);
        }

        return indexes;
    }

    // Returns array of three non-duplicating integers from 0-9
    function getRandomIndex(address account) internal returns (uint8)
    {
        uint8 maxValue = 10;

        // Pseudo random number...the incrementing nonce adds variation
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);

        if (nonce > 250) {
            nonce = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }

        return random;
    }
    event fundsReceived (address, uint256);
    receive() external payable {
        emit fundsReceived(msg.sender, msg.value);
    }

// endregion

}   
