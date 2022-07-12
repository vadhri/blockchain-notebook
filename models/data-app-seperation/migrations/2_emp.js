const emp = artifacts.require("Employee");
const empapp = artifacts.require("EmployeeApp");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(emp);
    await deployer.deploy(empapp, emp.address);
};