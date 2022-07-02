// SPDX-License-Identifier: MIT
pragma solidity >=0.4.9  <=0.9.0;

contract MarketPlace {
    enum catalogue {Football, Basketball, CricketBall, Baseball}
    struct Item {
        catalogue itemId;
        string manufacturer;
        uint256 price;
        address seller;
        uint256 quantity;
    }

    mapping(uint8 => mapping(address => Item)) availableOptions;
    mapping(uint8 => address[]) sellersByItem;
    mapping(uint8 => uint256) skuByItem;

    function addItem(catalogue itemId, string memory manufacturer, uint256 price, uint256 quantity) public returns (uint256){
        Item memory i = Item(itemId, manufacturer, price, msg.sender, quantity);
        availableOptions[uint8(itemId)][msg.sender] = i;
        sellersByItem[uint8(itemId)].push(msg.sender);
        skuByItem[uint8(itemId)] += quantity;

        return skuByItem[uint8(itemId)];
    }
    
    function updateStock(catalogue itemId, uint256 quantity) public {
        availableOptions[uint8(itemId)][msg.sender].quantity += quantity;
    }

    function getSellersByItem(catalogue itemId) public view returns (address[] memory) {
        return sellersByItem[uint8(itemId)];
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a <= b ? a : b;
    }

    function getStockBySeller(catalogue itemId, address seller) public view returns (uint256) {
        return availableOptions[uint8(itemId)][seller].quantity;
    }

    function getAllStockByItem(catalogue itemId) public view returns (uint256) {
        return skuByItem[uint8(itemId)];
    }

    function buyItemForAnyPrice(catalogue itemId, uint256 quantity) public payable {
        uint8 itm = uint8(itemId);
        require(skuByItem[uint8(itemId)] >= quantity);

        address[] memory sellers = sellersByItem[uint8(itemId)];

        require(sellers.length > 0);

        for (uint i = 0; i< sellers.length; i++ ) {
            if (availableOptions[itm][sellers[i]].quantity > 0) {
                uint256 available = min(availableOptions[itm][sellers[i]].quantity, quantity);
                availableOptions[itm][sellers[i]].quantity -= available;
                uint256 cost = availableOptions[itm][sellers[i]].price * available;
                quantity -= available;
                skuByItem[itm] -= available;
                payable(sellers[i]).transfer(cost);

                if (quantity == 0) {
                    break;
                }
            }
        }
    } 
}