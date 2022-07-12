import Web3 from "web3";
import ArtGallery from "../../build/contracts/ArtGallery.json"; // Importing the JSON representation of the Smart Contract

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ArtGallery.networks[networkId];
      this.meta = new web3.eth.Contract(
        ArtGallery.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  refreshBalance: async function() {
    const { getBalance } = this.meta.methods;
    const balance = await getBalance(this.account).call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;
  },
  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
  createArtItem: async function() {
    const { addArt } = this.meta.methods;
    const name = document.getElementById("name").value;
    const id = document.getElementById("id").value;
    await addArt(name, 100, id).send({from: this.account});
    App.setStatus("New Art Owner is " + this.account + ".");
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live",
    );
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );
  }

  App.start();
});
