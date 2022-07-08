// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract TaxCollector {
    uint256 public balance = 0;
    event Received(address user, uint amount);

    function getBalance() external view returns(uint256){
        return address(this).balance;
    }

    receive() external payable {
        // balance += msg.value;
        emit Received(msg.sender, msg.value);
    }            
}

contract goodsTax is TaxCollector {
    function getGoodsTaxPercent() public pure returns (uint256) {
        return 10;
    } 
}

contract serviceTax is TaxCollector {   
    function getServiceTaxPercent() public pure returns(uint256) {
        return 10;
    }
}

contract stateTax is TaxCollector {
    function getStateTaxPercent() public pure returns (uint256) {
        return 10;
    }
}

contract Sale {
    mapping(uint256 => uint256) catalogue;  

    address public merchant;

    address payable public serviceTaxAddress;
    address payable public goodsTaxAddress;
    address payable public stateTaxAddress;
    address stc;

    constructor(address serviceTaxContract, address goodsTaxContract, address stateTaxContract) {
        merchant = msg.sender;
        stc = serviceTaxContract;
        serviceTaxAddress = payable(serviceTaxContract);
        goodsTaxAddress = payable(goodsTaxContract);
        stateTaxAddress = payable(stateTaxContract);
    }

    function bytesToUint(bytes memory b) internal pure returns (uint256){
            uint256 number;
            for(uint i=0;i<b.length;i++){
                number = number + uint(uint8(b[i]))*(2**(8*(b.length-(i+1))));
            }
        return number;
    }

    function purchase(uint256 itemId) public payable returns (bool) {
        require(msg.value >= catalogue[itemId]);
        uint256 pendingPercent = 100;
        uint256 returnmoney = msg.value - catalogue[itemId];
        uint256 cost = catalogue[itemId];
        
        (bool success, bytes memory percent) = serviceTaxAddress.call(
            abi.encodeWithSignature("getServiceTaxPercent()")
        );

        uint256 percentServiceTax = bytesToUint(percent);
        
        serviceTaxAddress.transfer((cost * percentServiceTax)/100);

        pendingPercent -= percentServiceTax;

        (success, percent) = goodsTaxAddress.call(
            abi.encodeWithSignature("getGoodsTaxPercent()")
        );
        uint256 percentGoodsTax = bytesToUint(percent);
        pendingPercent -= percentGoodsTax;

        goodsTaxAddress.transfer((cost * percentGoodsTax)/100);

        (success, percent)  = stateTaxAddress.call(
            abi.encodeWithSignature("getStateTaxPercent()")
        );

        uint256 percentStateTax = bytesToUint(percent);
        pendingPercent -= percentStateTax;

        stateTaxAddress.transfer((cost * percentStateTax)/100);
                                     
        payable(merchant).transfer((cost * pendingPercent)/100);

        if (returnmoney > 0) {
            payable(msg.sender).transfer(returnmoney);
        }

        return true;
    }
 
    function addItem(uint256 id, uint256 priceInLowestDenomination) public  returns (bool) {
        catalogue[id] = priceInLowestDenomination;
        return false;
    }
}