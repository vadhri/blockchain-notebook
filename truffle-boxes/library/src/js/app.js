App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load books.
    $.getJSON('../books.json', function(data) {
      var bookRow = $('#bookRow');
      var bookTemplate = $('#bookTemplate');

      for (i = 0; i < data.books.length; i++) {
        bookTemplate.find('.pet-breed').text(data.books[i].title);
        bookTemplate.find('.pet-age').text(data.books[i].author);
        bookTemplate.find('.pet-location').text(data.books[i].description);

        bookTemplate.find('.btn-borrow').attr('data-id', data.books[i].isbn);
        bookTemplate.find('.btn-borrow').attr('data-index', i);
        bookTemplate.find('.btn-borrow').attr('text', "Borrow");

        bookRow.append(bookTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Borrow.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var BorrowArtifact = data;
      App.contracts.Borrow = TruffleContract(BorrowArtifact);
    
      // Set the provider for our contract
      App.contracts.Borrow.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markBorrowed();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-borrow', App.handleBorrow);
  },

  markBorrowed: function() {
    var borrowInstance;

    App.contracts.Borrow.deployed().then(function(instance) {
      borrowInstance = instance;
    
      return borrowInstance.get_borrowers.call();
    }).then(function(borrowers) {
      for (i = 0; i < borrowers.length; i++) {
        if (borrowers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Borrowed').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleBorrow: function(event) {
    event.preventDefault();

    var bookId = parseInt($(event.target).data('index'));
    var borrowInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Borrow.deployed().then(function(instance) {
        borrowInstance = instance;
    
        // Execute adopt as a transaction by sending account
        return borrowInstance.borrow_book(bookId, {from: account});
      }).then(function(result) {
        return App.markBorrowed();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init(); 
  });
});
