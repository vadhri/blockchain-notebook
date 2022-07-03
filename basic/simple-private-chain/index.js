var crypto = require('crypto-js')
var {Block, BlockChain} = require('./block-definitions')

var chain = new BlockChain()

chain.addBlock(new Block("test data 1"))
chain.addBlock(new Block("test data 2"))

console.log(JSON.stringify(chain))