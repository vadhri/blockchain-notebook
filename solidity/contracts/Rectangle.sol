// SPDX-License-Identifier: MIT
pragma solidity >=0.4.10;

interface Dot {
    struct Point {
        int256 x;
        int256 y;
        bool exists;
    }
}

interface Polygon is Dot {
    function getPoints() external returns (Point[] memory);
}

interface EditPolygon is Dot {
    function addPoint(int256 x, int256 y) external returns (bool);
}

contract Distance is Dot {
    function abs(int256 x) internal pure returns (uint256) {
        if (x < 0) {
            return uint256(0-x);
        } else {
            return uint256(x);
        }
    }
    function distance(Point memory a, Point memory b) public pure returns (uint256) {
        return abs(a.x - b.x) + abs(a.y - b.y);
    }
}

contract Rectangle is Polygon, EditPolygon {
    Point [] points;
    Distance d = new Distance();

    function getPoints() external view returns (Point[] memory) {
        return points;
    }

    function pointExists(int256 x, int256 y) internal view returns (bool) {
        for (uint256 index = 0; index < points.length; index++) {
            if (points[index].x == x && points[index].y == y) {
                return true;
            }
        }
        return false;
    }

    function addPoint(int256 x, int256 y) external returns (bool) {
        if (pointExists(x, y) == false) {
            Point memory p = Point(x, y, true);
            points.push(p);
            return true;
        } 
        return false;
    }

    function getDistanceBetweenPointsAtIndex(uint8 a, uint8 b) public view returns (uint256) {
        return d.distance(points[a], points[b]);
    }

    function pointCount() public view returns (uint256) {
        return points.length;
    }
}