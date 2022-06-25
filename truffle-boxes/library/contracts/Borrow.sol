pragma solidity ^0.5.0;

contract Borrow {
    address[10] public borrowers;

    // Borrow a book from library.
    function borrow_book(uint bookId) public returns (uint) {
        require(bookId >= 0 && bookId <= 10);
        borrowers[bookId] = msg.sender;
        return bookId;
    }

    function get_borrowers() public view returns (address[10] memory) {
        return borrowers;
    }
}