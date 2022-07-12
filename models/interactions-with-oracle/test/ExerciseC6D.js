
// var Test = require('./testConfig.js');
//var BigNumber = require('bignumber.js');

var FlightStatus = artifacts.require("FlightStatus");

contract('FlightStatus', async (accounts) => {

  const TEST_ORACLES_COUNT = 5;
  var config;
  before('setup contract', async () => {
    let instance = await FlightStatus.deployed();
    config = {
      owner: accounts[0],
      testAddresses: accounts,
      exerciseC6D: instance
    }
    
    // Watch contract events
    const ON_TIME = 10;

    config.exerciseC6D.OracleRequest({}, (error, result) => {
      console.log(`\n\nOracle Requested: index: ${result.args.index.toString()}, flight:  ${result.args.flight}, timestamp: ${result.args.timestamp.toString()}`);
    });

    config.exerciseC6D.FlightStatusInfo({}, (error, result) => {
      console.log(`\n\nFlight Status Available: flight: ${result.args.flight}, timestamp: ${result.args.timestamp.toString()}, status: ${result.args.status.toNumber() == ON_TIME ? 'ON TIME' : 'DELAYED'}, verified: ${result.args.verified ? 'VERIFIED' : 'UNVERIFIED'}`);
    });    

    // Past events
    //events.get((error, logs) => {  });

  });


  it('can register oracles', async () => {
    
    // ARRANGE
    let fee = await config.exerciseC6D.REGISTRATION_FEE.call();

    console.log ("Fee to be used", fee.toString());

    // ACT
    for(let a=1; a<TEST_ORACLES_COUNT; a++) {      
      await config.exerciseC6D.registerOracle({ from: accounts[a], value: fee });
    }
  });

  it('can request flight status', async () => {
    
    // ARRANGE
    let flight = 'ND1309'; // Course number
    let timestamp = Math.floor(Date.now() / 1000);

    // Submit a request for oracles to get status information for a flight
    await config.exerciseC6D.fetchFlightStatus(flight, timestamp);

    // ACT

    // Since the Index assigned to each test account is opaque by design
    // loop through all the accounts and for each account, all its Indexes (indices?)
    // and submit a response. The contract will reject a submission if it was
    // not requested so while sub-optimal, it's a good test of that feature
    for(let a=1; a<TEST_ORACLES_COUNT; a++) {

      // Get oracle information
      // For a real contract, we would not want to have this capability
      // so oracles can remain secret (at least to the extent one doesn't look
      // in the blockchain data)
      let oracleIndexes = await config.exerciseC6D.getOracle(accounts[a]);
      for(let idx=0;idx<3;idx++) {

        try {
          // Submit a response...it will only be accepted if there is an Index match
          await config.exerciseC6D.submitOracleResponse(oracleIndexes[idx], flight, timestamp, 10, { from: accounts[a] });

          // Check to see if flight status is available
          // Only useful while debugging since flight status is not hydrated until a 
          // required threshold of oracles submit a response
          let flightStatus = await config.exerciseC6D.viewFlightStatus(flight, timestamp);
          console.log('\nPost', idx, oracleIndexes[idx].toString(), flight, timestamp, flightStatus);
        }
        catch(e) {
          // Enable this when debugging
          console.log('\nError', idx, oracleIndexes[idx].toString(), flight, timestamp);
        }

      }
    }
  });
});
