import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';

import Config from './config.json';
import Web3 from 'web3';
import express from 'express';

let config = Config['localhost'];

let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
let flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);

async function registerOracles() {
  const accounts = await web3.eth.getAccounts();
  const fee  = await flightSuretyApp.methods.getRegistrationFeeForOracle().call({from: accounts[0]});

	for (var i = 20; i < 30; i++) {
		var account = accounts[i];

		console.log('account=', account)
			await flightSuretyApp.methods.registerOracle().send({
			from: account,
			value: fee,
			gas: 6721900
		});
	}
	console.log('[', accounts.length, '] Oracles registered');
}

async function simulateOracleResponse(requestedIndex, airline, flight, timestamp) {
	const accounts = await web3.eth.getAccounts();
	for (var i = 20; i < 30; i++) {
		let account = accounts[i];

		var indexes = await flightSuretyApp.methods.getMyIndexes().call({ from: account });
		console.log("Oracles indexes: " + indexes + " for account: " + account);
		for (const index of indexes) {
			try {
				if (requestedIndex == index) {
					console.log("Submitting Oracle response For Flight: " + flight + " at Index: " + index);
					await flightSuretyApp.methods.submitOracleResponse(
						index, airline, flight, timestamp, 20
					).send({ from: account, gas: 6721900 });

				}
			} catch (e) {
				console.log(e);
			}
		}
	}
}

registerOracles(); 

flightSuretyApp.events.OracleRequest({}).on('data', async (event, error) => {
	if (!error) {
		await simulateOracleResponse(
			event.returnValues[0],
			event.returnValues[1],
			event.returnValues[2],
			event.returnValues[3] 
		);
	}
});

flightSuretyApp.events.FlightStatusInfo({}).on('data', async (event, error) => {
	console.log("event=", "FlightStatusInfo", event.returnValues[3]);
	console.log("error=", error);
});

flightSuretyData.events.BalanceChangeNotification({}).on('data', async (event, error) => {
	console.log("event=", event.returnValues);
	console.log("error=", error);
});

flightSuretyApp.events.creditInsureesNotification({}).on('data', async (event, error) => {
	console.log("event=", event.returnValues);
	console.log("error=", error);
});

flightSuretyData.events.FundsTransferred({}).on('data', async (event, error) => {
	console.log("event FundsTransferred=", event.returnValues);
	console.log("error=", error);
});

const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
})

export default app;


