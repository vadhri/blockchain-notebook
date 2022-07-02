// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "../node_modules/openzeppelin-solidity/contracts/utils/Counters.sol";

contract ArtGallery is ERC721 {
    address artAdmin;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct ArtItem {
        string name;
        string id;
        uint256 price;
    }

    mapping (uint256 => ArtItem) gallery;
    mapping (uint256 => uint256) itemsForSale;

    constructor() ERC721("ArtLibrary", "ART") {
        artAdmin = msg.sender;
    }

    /* Add art to gallery and put up for sale */
    function addArt(string memory name, uint256 price, string memory artId) public returns (uint256) {
        require(msg.sender == artAdmin);
        uint256 current_token = _tokenIds.current();
        itemsForSale[current_token] = price; 
        gallery[current_token] = ArtItem(name, artId, price);
        _mint(artAdmin, current_token);
        _tokenIds.increment();
        return current_token;
    } 

    function buyArt(uint256 artId) public payable {
        require(itemsForSale[artId] > 0);
        uint256 saleCost = itemsForSale[artId];
        require(msg.value >= saleCost);
        address artOwner = ownerOf(artId);

        safeTransferFrom(artOwner, msg.sender, artId);
    }

    function approveSale(address to, uint256 tokenId) public returns (uint256) {
        require(ownerOf(tokenId) == msg.sender);
        approve(to, tokenId);
    }

    function getArtItemByTokenId(uint256 artId) public view returns (ArtItem memory) {
        return gallery[artId];
    }
} 