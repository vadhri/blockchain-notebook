// SPDX-License-Identifier: MIT
import "../node_modules/openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "./Employee.sol";

contract EmployeeApp {
    using SafeMath for uint256;
    Employee employee;

    address private contractOwner;              // Account used to deploy contract
    constructor(address dataContract) {
        contractOwner = msg.sender;
        employee = Employee(dataContract);
    }
    
    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }
    function addSale(string memory id, uint256 amount) public requireContractOwner {
        employee.updateEmployee(id, amount, calculateBonus(amount));
    }
    function calculateBonus(uint256 sales) internal pure returns(uint256) {
        if (sales < 100) {
            return sales.mul(5).div(100);
        }
        else if (sales < 500) {
            return sales.mul(7).div(100);
        }
        else {
            return sales.mul(10).div(100);
        }
    }
}