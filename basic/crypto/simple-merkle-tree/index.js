const { SHA256 } = require("crypto-js");
const { MerkleTree } = require('merkletreejs')

var chain = []

var transactions = [
    {
        from: "A",
        to: "B",
        value: 4
    },
    {
        from: "B",
        to: "C",
        value: 10
    },
    {
        from: "C",
        to: "A",
        value: 2
    },
]

var prev_hash = null;
var merkelTreeLeaves = transactions.map(x => JSON.stringify(x))

const tree = new MerkleTree(merkelTreeLeaves, SHA256);

console.log(tree.toString());