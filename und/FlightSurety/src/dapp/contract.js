import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

const flights = ["DELBLR", "BLRHYD", "HYDCHE", "CHEGOA"];

export default class Contract {
    constructor(network, callback) {
        this.config = Config[network];
        this.initialize(callback);
        this.owner = null;
    }
    
    async initialize(callback) {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            this.owner = accounts[0];
            console.log('MetaMask is installed!', this.owner);
            
            this.web3 = new Web3(ethereum);
            this.web3.eth.defaultAccount = accounts[0];
            this.web3.eth.handleRevert = true
            this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, this.config.appAddress);
            this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, this.config.dataAddress);

            callback();
        }
    }
    withdraw(callback) {
        this.flightSuretyApp.methods.withDraw().send({from: this.owner, gas: 100000}, (error, result) => {
            console.log(error, result);
        }).then(receipt => {
            console.log(receipt);
            callback(true, receipt);
        }).catch(error => {
            console.log("Error =>", error);
        })
    }
    checkBalance(flight, address, callback) {
        this.flightSuretyApp.methods.getPassengerBalance(flight).call({from: this.owner}, callback);
    }

    async isOperational(callback) {
       let self = this;
       let z = await self.flightSuretyData.methods
            .addressDump().call();  
        
        console.log("Registered accounts : ", z);   
        self.flightSuretyApp.methods
            .isOperational()
            .call({from: this.owner}, callback);
    }

    transferFunds(_value, callback) {
        this.flightSuretyApp.methods.fundAirline().send({from: this.owner, value: _value}, (error, result) => {
            console.log("Testing the funds transfer", error, result);
        }).then(receipt => {
            console.log(receipt);
            callback(true, "Funds transferred " + _value)
        }).catch(error => {
            callback(true, "Funds failed transfer " + _value)
        })
    }

    buyInsurance(flight, _value, callback) {
        this.flightSuretyApp.methods.buyInsurance(flight).send({from: this.owner, value: _value}, (error, result) => {
            console.log("Airline status", result);
        }).then(e => {
            console.log("Insurance bought ", e);
        }).catch(err => {
            console.log("Error buying insurance. ", err);
        });        
    }

    fetchAirlineStatus(airline, callback) {
        this.flightSuretyApp.methods.isRegisteredAirline(airline).send({from: this.owner}, (error, result) => {
            console.log("Airline status", result);
        }).then(e => {
            console.log("Error ", e);
        }).catch(err => {
            console.log("Airline status ", err)
        });
    }

    fetchFlightStatus(airline, flight, timestamp, callback) {
        let self = this;

        console.log("fetchFlightStatus", airline, flight, timestamp);

        self.flightSuretyApp.methods
            .fetchFlightStatus(airline, flight, timestamp)
            .send({ from: self.owner}, (error, result) => {     
                console.log(result)
                callback(error, {flight: flight, timestamp: timestamp});
            }).then(receipt => {
                console.log(receipt);
            })
    }

    async registerAirline(airlineName, airlineAddress, callback) {
        console.log("registerAirline ", airlineName, this.owner);
        
        let z = this.flightSuretyApp.methods.registerAirline(airlineAddress)
            .send({ from: this.owner }).then(receipt => {
                console.log("Events emitted", Object.keys(receipt.events).length);
                if (Object.keys(receipt.events).length > 0) {
                    console.log(JSON.stringify(receipt.events), "AirlineVoted" in receipt.events);

                    if ("AirlineRegistered" in receipt.events) {
                        const flightsAirline = flights.map(x => airlineName + x);

                        this.flightSuretyApp.methods.registerFlights(flightsAirline).send({from: this.owner}).then(x => {
                            this.flightSuretyData.methods.flightDump(this.owner).call({from: this.owner}).then(a => {
                                console.log("Flights ", a);
                              });                            
                            callback(null, receipt.transactionHash);
                        }).catch(err => {
                            console.log(err);
                        });
                    } else if ("AirlineVoted" in receipt.events) {
                        callback(null, "Airline voted for " + (receipt.events['AirlineVoted'].returnValues[1])) 
                    } else if ("AirlineAlreadyRegistered" in receipt.events) {
                        callback(null, "Airline already registered");
                    }
                }
            }).catch(err => {
                callback (false, 0)
            });
    }
}
