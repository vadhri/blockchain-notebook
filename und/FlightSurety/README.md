Versions of different components

Ganache v7.2.0
Solidity - 0.8.15 (solc-js)
Node v18.2.0
Web3.js v1.5.3

I used nvm with 16.5.0 node. Ganache contains 100 accounts just for testing purpose. Oracles are registered automatically between accounts 20-30 index. Please change it to your need, i did so to avoid using same accounts of airlines and passengers with oracles. 

The following commands in order worked well for me.

( use ganache gui and create 100 accounts, websockets are enabled in truffle config for events to be emitted, please use the right node version. )
truffle compile
truffle migrate --reset
truffle test 
( All tests will pass. )
npm run dapp
npm run server

For usage with dapp, please use metamask ( i connected metamask to the dapp ) and follow the steps with the following info ( three accounts : admin, airline, passenger). 

- The account the deployed the contract ( say admin ) will not have any flights registered. 
- Please use step 1 to register a new airline and that will automatically create the flights attached to the airline (DELBLR, BLRHYD, HYDCHE, CHEGOA) but they must be used with airline prefix. 
- Transfer funds into the contract with the new airliness address ( no max value ) Funds will be transfered to the data contract.
- switch to passenger account, buy insurance first and then check for flight status ( insurance amount will get credited )
- Check balance will be done per airline since a user could buy insurance for multiple flights. 
- Withdraw all - requests amount available for the user for all accounts. 


I did not use flight key concept but instead used the mapping between flights, airlines and passengers in the data aspect to make it more elaborate.

