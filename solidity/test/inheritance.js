var Distance = artifacts.require('Distance');
var Rectangle = artifacts.require('Rectangle');

let ct = null;

contract("Rectangle", function () {
    it('Manage rectangle polygon values ', function () {
        return Distance.deployed().then(dinstance => {

            return Rectangle.deployed().then(instance => {
                ct = instance;
                return ct.addPoint(10, 10);
            }).then(receipt => {
                return ct.addPoint(20, 20);
            }).then(receipt => {
                return ct.addPoint.call(10, 10);
            }).then(err => {
                assert(err == false, "rejected to be added to points;")
                return ct.pointCount();
            }).then(cnt => {
                assert(cnt == 2, "Expecting 2 points");
                return ct.getDistanceBetweenPointsAtIndex.call(0,1);
            }).then(dist => {
                assert(dist == 20, "distance is not correct !");
            });
        });
    });
})
