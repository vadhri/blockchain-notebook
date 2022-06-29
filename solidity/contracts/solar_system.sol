// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.10 <=0.9.0;

contract SolarSystem {
    enum Planets {Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Neptune, Uranus}
    mapping(Planets => mapping(Planets => uint256)) planetaryDistances;
    mapping(string => Planets) planetIndex;

    constructor() {
        planetIndex["Sun"] = Planets.Sun;
        planetIndex["Mercury"] = Planets.Mercury;
        planetIndex["Venus"] = Planets.Venus;
        planetIndex["Earth"] = Planets.Earth;
        planetIndex["Mars"] = Planets.Mars;
        planetIndex["Jupiter"] = Planets.Jupiter;
        planetIndex["Saturn"] = Planets.Saturn;
        planetIndex["Neptune"] = Planets.Neptune;
        planetIndex["Uranus"] = Planets.Uranus;
    }  

    function distanceFromSun(string memory _from, string memory _to) public view returns (uint256) {
        return planetaryDistances[planetIndex[_from]][planetIndex[_to]];
    }

    function setDistance(string memory _from, string memory _to, uint256 value) public returns (bool) {
        planetaryDistances[planetIndex[_from]][planetIndex[_to]] = value;
        return true;
    }
}