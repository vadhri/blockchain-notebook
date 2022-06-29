var solar_system = artifacts.require('SolarSystem');
let ct = null;

contract("SolarSystem", function () {
    it('set and get distances ', function () {
        solar_system.deployed().then(instance => {
            ct = instance;
            return ct.distanceFromSun("Sun", "Mercury");
        }).then(dist => {
            assert(dist != "", "value should be empty");
            return ct.setDistance("Sun", "Sun", 0);
        }).then(dist => {
            assert(dist != 0, "Planet is 0 farway from self.")
        })
    })  
})
