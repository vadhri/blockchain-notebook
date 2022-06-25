var crypto = require('crypto-js')

class Block {
    constructor(data) {
      this.hash = ""
      this.height = ""
      this.body = data
      this.time = 0,
      this.previousblockhash = ""
    }
}

class BlockChain {
   constructor() {
       this.chain = [];
   }
 addBlock(block) {
     block.height = this.chain.length;
     block.time = new Date().getTime().toString().slice(0, -3);
     
     if (this.chain.length > 0) {
         block.previousblockhash = this.chain[this.chain.length-1].hash;
     }
     block.hash = crypto.SHA256(JSON.stringify(block)).toString();
     this.chain.push(block);
 }
}

module.exports = {Block, BlockChain}