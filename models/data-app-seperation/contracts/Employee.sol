pragma solidity >=0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract Employee {
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    struct Profile {
        string id; 
        bool isRegistered;
        bool isAdmin;
        uint256 sales;
        uint256 bonus;
        address wallet;
    }

    address private contractOwner;              // Account used to deploy contract
    mapping(string => Profile) employees;      // Mapping for storing employees

    constructor() {
        contractOwner = msg.sender;
    }

    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    function isEmployeeRegistered(string memory id) external view returns(bool) {
        return employees[id].isRegistered;
    }

    function registerEmployee(string memory id, bool isAdmin, address wallet) external requireContractOwner {
        require(!employees[id].isRegistered, "Employee is already registered.");

        employees[id] = Profile({
                            id: id,
                            isRegistered: true,
                            isAdmin: isAdmin,
                            sales: 0,
                            bonus: 0,
                            wallet: wallet
                        });
    }

    function getEmployeeBonus(string memory id) external view requireContractOwner returns(uint256) {
        return employees[id].bonus;
    }

    function updateEmployee(string memory id, uint256 sales, uint256 bonus) external
    {
        require(employees[id].isRegistered, "Employee is not registered.");

        employees[id].sales = employees[id].sales.add(sales);
        employees[id].bonus = employees[id].bonus.add(bonus);

    }
}