var solar_system = artifacts.require('SolarSystem');
let ct = null;

contract("SolarSystem", function () {
    it('set and get distances ', function () {
        return solar_system.deployed().then(instance => {
            ct = instance;
            return ct.distance("Sun", "Mercury");
        }).then(dist => {
            assert(dist != "", "value should be empty");
            return ct.setDistance("Sun", "Sun", 0);
        }).then(receipt => {
            return ct.distance("Sun", "Sun");
        }).then(dist => {
            assert(dist == 0, "Planet is 0 farway from self.")
        })
    })  
})
