pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;
import "./ERC721Mintable.sol";
import "./verifier.sol";

// define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is Verifier, ERC721MintableComplete {
    // define a solutions struct that can hold an index & an address
    struct Solution {
        bytes32 index;
        uint256 tokenId;
        address addr;
    }

    // define an array of the above struct
    mapping(uint256 => Solution) solutions;

    // define a mapping to store unique solutions submitted
    mapping(bytes32 => bool) submittedSolutions;

    // Create an event to emit when a solution is added
    event SolutionAdded(bytes32 key, address addr, uint256 tokenId);

    // Create a function to add the solutions to the array and emit the event
    function addSolution(
        address addr,
        uint256 tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        bytes32 key = keccak256(
            abi.encodePacked(tokenId, addr,a,b,c, input)
        );
        require(!submittedSolutions[key], "The solution has been used before");
        bool isValid = verifyTx(a,b,c,input);
        require(isValid, "The proof is not valid");
        Solution memory solution = Solution(key, tokenId, addr);
        solutions[tokenId] = solution;
        submittedSolutions[key] = true;
        emit SolutionAdded(key, addr, tokenId);
    }

    // Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(address addr, uint256 tokenId) public returns (bool) {
        require(
            solutions[tokenId].addr != address(0),
            "The solution has been used before"
        );
        return super.mint(addr, tokenId);
    }
}
