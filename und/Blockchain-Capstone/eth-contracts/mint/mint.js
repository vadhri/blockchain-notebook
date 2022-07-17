require('dotenv').config({ path: '../.env' })
const HDWalletProvider = require('@truffle/hdwallet-provider')
const zokratesProof = [
    require("./proof_0.json"),
    require("./proof_1.json"),
    require("./proof_2.json"),
    require("./proof_3.json"),
    require("./proof_4.json"),
    require("./proof_5.json"),
    require("./proof_6.json"),
    require("./proof_7.json"),
    require("./proof_8.json"),
    require("./proof_9.json"),
]

const web3 = require('web3')
const MINT_COUNT = 10
const infuraKey = process.env.INFURA_API_URL
const mnemonic = process.env.MNEMONIC
const OWNER_ADDRESS = process.env.OWNER
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
const contractJson = require('../build/contracts/SolnSquareVerifier.json')

async function main() {
    console.log(infuraKey, mnemonic)
    console.log(require('dotenv'))
    const provider = new HDWalletProvider(mnemonic, infuraKey)
    const web3Instance = new web3(provider)
    const contract = await new web3Instance.eth.Contract(contractJson.abi, CONTRACT_ADDRESS, { gasLimit: "1000000" })
    for (let idx = 0; idx < MINT_COUNT; idx++) {
        try {
            let proof = zokratesProof[idx].proof
            let inputs = zokratesProof[idx].inputs
            console.log("OWNER_ADDRESS " + OWNER_ADDRESS + "\n")
            console.log("index " + idx + "\n")
            console.log("proof " + JSON.stringify(proof) + "\n")
            console.log("input " + inputs + "\n")
            let tx = await contract.methods.addSolution(
                OWNER_ADDRESS,
                idx,
                proof.a,
                proof.b,
                proof.c,
                inputs
            ).send({ from: OWNER_ADDRESS })
            console.log("Solution added. Transaction: " + tx.transactionHash)
            tx = await contract.methods.mint(OWNER_ADDRESS, idx).send({ from: OWNER_ADDRESS })
            console.log("Minted item. Transaction: " + tx.transactionHash)
        } catch (e) {
            console.log(e)
        }
    }
}

main()