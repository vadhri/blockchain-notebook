
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => { 
            display('display-wrapper-operational', 'Operational Status', 
                'Check if contract is operational', 
                [{ label: 'Operational Status', error: error, value: result }]);
        });

        DOM.elid("withdraw-balance").addEventListener('click', () => {
            contract.withdraw((error, result) => {
                console.log(error, result);
            })
        })
        
        DOM.elid('check-balance').addEventListener('click', () => {
            let flight = DOM.elid('passanger-flight').value;
            let address = DOM.elid('passanger-address').value;
            console.log(flight, address);

            contract.checkBalance(flight, address, (error, result) => {
                console.log(error, result);
                if (error == false) {
                    DOM.elid('display-wrapper-passenger-detail').value = result;
                } else {
                    DOM.elid('display-wrapper-passenger-detail').value = result;
                }
            });            
        });

        DOM.elid('fund-airline').addEventListener('click', () => {
            let funds = DOM.elid('airline-value').value;
            console.log(funds);
            try {
                contract.transferFunds(funds, (error, result) => {
                    console.log(error, result);
                    if (error == false) {
                        DOM.elid('fstatus').value = result;
                    } else {
                        DOM.elid('fstatus').value = result;
                    }
                });
            }
            catch (error) {
                displayTx('display-wrapper-register', [{ label: 'Airline not registered Tx', error: error, value: error.message }]);
            }            
        })
        DOM.elid('submit-airline').addEventListener('click', () => {
            let airlineAddress = DOM.elid('airline-address').value;
            let airlineName = DOM.elid('airline-name').value;
            let success = false; 
            let votes = 0;
            
            try {
                contract.registerAirline(airlineName, airlineAddress, (error, result) => {
                    console.log(error, result);
                    if (error == false) {
                        displayTx('display-wrapper-register', [{ label: 'Airline not registered Tx', value: result}]);
                    } else {
                        displayTx('display-wrapper-register', [{ label: 'Airline registered Tx', error: error, value: result }]);  
                    }
                    DOM.elid('airline-address').value = "";
                });
            }
            catch (error) {
                displayTx('display-wrapper-register', [{ label: 'Airline not registered Tx', error: error, value: error.message }]);
            }
        })

        DOM.elid('fetch-status').addEventListener('click', () => {
            let airline = DOM.elid('airline-address-for-flight').value;
            let flight = DOM.elid('airline-flight').value;
            // Write transaction
            contract.fetchFlightStatus(airline, flight, Date.now(), (error, result) => {
                console.log(result);
                display("airline-status", 'Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            })
        })
        DOM.elid('submit-buy').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            let insuredAmount = DOM.elid('insurance-amount').value;
            // Write transaction
            contract.buyInsurance(flight, insuredAmount, (error, result) => {
                console.log(result);
                display('Oracles', 'Trigger buy', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
        })
    });
})();


function display(id, title, description, results) {
    let displayDiv = DOM.elid(id);
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({ className: 'row' }));
        row.appendChild(DOM.div({ className: 'col-sm-4 field' }, result.label));
        row.appendChild(DOM.div({ className: 'col-sm-8 field-value' }, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}

function displayTx(id, results) {
    console.log(id, results);

    let displayDiv = DOM.elid(id);
    results.map((result) => {
        let row = displayDiv.appendChild(DOM.div({ className: 'row' }));
        row.appendChild(DOM.div({ className: 'col-sm-3 field' }, result.error ? result.label + " Error" : result.label));
        row.appendChild(DOM.div({ className: 'col-sm-9 field-value' }, result.error ? String(result.error) : String(result.value)));
        displayDiv.appendChild(row);
    })
}


