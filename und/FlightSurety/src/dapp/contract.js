import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {
        this.config = Config[network];
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
    }
    
    async initialize(callback) {
        if (typeof window.ethereum !== 'undefined') {

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            this.owner = accounts[0];
            let counter = 1;

            console.log('MetaMask is installed!', this.owner);
            
            while(this.airlines.length < 5) {
                this.airlines.push(accounts[counter++]);
            }
            
            while(this.passengers.length < 5) {
                this.passengers.push(accounts[counter++]);
            }

            await ethereum.enable();
            
            this.web3 = new Web3(ethereum);
            this.web3.eth.defaultAccount = accounts[0];
            this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, this.config.appAddress);
            this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, this.config.dataAddress);
            console.log("Meta mask account =>", this.owner, window.ethereum.currentProvider);
            callback();
        }
    }

    async isOperational(callback) {
       let self = this;
       await self.flightSuretyData.methods.authorizeCaller(this.owner);

       let z = await self.flightSuretyData.methods
            .addressDump().call();  
       
        console.log(z);
       
       self.flightSuretyApp.methods
            .isOperational()
            .call({from: this.owner}, callback);
    }

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        } 
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }
    async registerAirline(airlineName, airlineAddress, callback) {
        console.log(">>>>>> ",airlineName, this.owner);
        let self = this;
        let z = await self.flightSuretyApp.methods.registerAirline(airlineAddress).send({ from: this.owner, gas: 6721900 });
        callback(z.id, z.transactionHash);
    }

}