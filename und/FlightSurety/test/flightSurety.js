
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
  });

  // it(`(multiparty) has correct initial isOperational() value`, async function () {

  //   // Get operating status
  //   let status = await config.flightSuretyData.isOperational.call();
  //   assert.equal(status, true, "Incorrect initial operating status value");

  // });

  // it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

  //     // Ensure that access is denied for non-Contract Owner account
  //     let accessDenied = false;
  //     try 
  //     {
  //         await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
  //     }
  //     catch(e) {
  //         accessDenied = true;
  //     }
  //     assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  // });

  // it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

  //     // Ensure that access is allowed for Contract Owner account
  //     let accessDenied = false;
  //     try 
  //     {
  //         await config.flightSuretyData.setOperatingStatus(false);
  //     }
  //     catch(e) {
  //         accessDenied = true;
  //     }
  //     assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
  // });

  // it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

  //     await config.flightSuretyData.setOperatingStatus(false);

  //     let reverted = false;
  //     try 
  //     {
  //         await config.flightSurety.setTestingMode(true);
  //     }
  //     catch(e) {
  //         reverted = true;
  //     }
  //     assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

  //     // Set it back for other tests to work
  //     await config.flightSuretyData.setOperatingStatus(true);

  // });

  // it('(airline) cannot register an Airline using registerAirline() from an un-registered airline.', async () => {
    
  //   // ARRANGE
  //   let newAirline = accounts[2];
  //   let a;
  //   let b;
  //   // ACT
  //   try {
  //       await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
  //   }
  //   catch(e) {
  //   }
    
  //   let result = false;
  //   try {
  //       result = await config.flightSuretyData.isAirline.call(newAirline, {from: config.owner}); 
  //   } catch {
  //   }
    
  //   assert(result == false, "Airline should not be able to register another airline if it hasn't provided funding");

  // });
 
  // it('(airline) register airline, after first one', async () => {
  //   try {
  //       a = await config.flightSuretyApp.registerAirline(config.firstAirline, {from: accounts[0]});
  //       b = await config.flightSuretyApp.registerAirline(accounts[1], {from: accounts[0]});
  //       b = await config.flightSuretyApp.registerAirline(accounts[2], {from: accounts[0]});
  //       b = await config.flightSuretyApp.registerAirline(accounts[3], {from: accounts[0]});
  //       b = await config.flightSuretyApp.registerAirline(accounts[4], {from: accounts[0]});
  //       let r = await config.flightSuretyApp.airlineVotes.call(accounts[4]);
  //       assert(r.length == 1, "One voter.")
  //       b = await config.flightSuretyApp.registerAirline(accounts[4], {from: accounts[2]});
  //       let r1 = await config.flightSuretyApp.airlineVotes.call(accounts[4]);
  //       assert(r1.length == 2, "two voters ")
  //       b = await config.flightSuretyApp.registerAirline(accounts[5], {from: accounts[4]});
  //       b = await config.flightSuretyApp.registerAirline(accounts[5], {from: accounts[0]});
  //       b = await config.flightSuretyApp.registerAirline(accounts[5], {from: accounts[0]});
  //       b = await config.flightSuretyApp.registerAirline(accounts[5], {from: accounts[0]});
  //       b = await config.flightSuretyApp.registerAirline(accounts[5], {from: accounts[0]});
  //       b = await config.flightSuretyApp.registerAirline(accounts[5], {from: accounts[0]});
  //       b = await config.flightSuretyApp.registerAirline(accounts[5], {from: accounts[1]});

  //       let r2 = await config.flightSuretyApp.airlineVotes.call(accounts[5]);
  //       assert(r2.length == 3, "three voter expected")
  //   }
  //   catch(e) {
  //   }

  //   let result = await config.flightSuretyData.isAirline.call(accounts[5]); 
  //   assert.equal(result, true, "Airline should not be able to register another airline if it hasn't provided funding");
  // });

  it("Fund airline (self)", async () => {
    a = await config.flightSuretyApp.registerAirline(config.firstAirline, {from: accounts[0]});
    b = await config.flightSuretyApp.fundAirline({from: accounts[1], value: 100000000000000000});
    b = await config.flightSuretyApp.registerFlights(["IND1234"], {from: accounts[1]});

    b = config.flightSuretyData.flightDump(accounts[1]).then(a => {
      console.log("Flights ", a);
    });

    b = await config.flightSuretyApp.buyInsurance("IND1234", {from: accounts[1], value: 10000000});

    config.flightSuretyData.isInsured.call("IND1234", accounts[1]).then((balance) => {
      console.log("Insured amount of passenger => ", balance.toString());
      assert(balance.toString() == "99", "Incorrect insured amount")
    });
    b = config.flightSuretyApp.buyInsurance("IND1234", {from: accounts[1], value: 10000000000000000000}).catch(error => {
      assert(error.message.indexOf("revert") >= 0, "Transaction not reverted due to more balance");
    });
    config.flightSuretyData.isInsured.call("IND1234", accounts[1]).then((balance) => {
      console.log("Insured amount of passenger => ", balance.toString());
      assert(balance.toString() == "99", "Incorrect insured amount")
    });    
    config.flightSuretyApp.fetchFlightStatus(accounts[1], "LHDELBLR", 12312132).then(status => {
      console.log("fetchFlightStatus ", status);
    });  
  })
});
