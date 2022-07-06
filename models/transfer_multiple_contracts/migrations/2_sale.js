const Sale = artifacts.require("Sale");
const serviceTax = artifacts.require("serviceTax");
const goodsTax = artifacts.require("goodsTax");
const stateTax = artifacts.require("stateTax");

module.exports = async function (deployer) {
    let serviceTaxAddress = await deployer.deploy(serviceTax);
    let goodsTaxAddress = await deployer.deploy(goodsTax);
    let stateTaxAddress = await deployer.deploy(stateTax);

    let contractAddress = await deployer.deploy(Sale, serviceTax.address, goodsTax.address, stateTax.address);
    console.log(serviceTax.address, goodsTax.address, stateTax.address)
};

  