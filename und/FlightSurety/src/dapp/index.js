
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error, result);
            
            display('display-wrapper-operational', 'Operational Status', 'Check if contract is operational', [{ label: 'Operational Status', error: error, value: result }]);
        });

        DOM.elid('submit-airline').addEventListener('click', () => {
            let airlineName = DOM.elid('airline-name').value;
            let airlineAddress = DOM.elid('airline-address').value;
            console.log(airlineAddress);
            contract.registerAirline(airlineName, airlineAddress, (error, result) => {
                displayTx('display-wrapper-register', [{ label: 'Airline registered Tx', error: error, value: result }]);
                DOM.elid('airline-name').value = "";
                DOM.elid('airline-address').value = "";
            });
        })

        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                console.log(result);
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
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


