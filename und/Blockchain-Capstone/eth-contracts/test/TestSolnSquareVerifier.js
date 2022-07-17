var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const zkProof = require("../../zokrates/proof.json");

contract('SolnSquareVerifier', accounts => {

    describe('test SolnSquareVerifier contract', function () {
        beforeEach(async function () {
            this.contract = await SolnSquareVerifier.new();
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('test if a new solution can be added', async function () {
            let tx = await this.contract.addSolution(
                accounts[0],
                1,
                zkProof.proof.a,
                zkProof.proof.b,
                zkProof.proof.c,
                zkProof.inputs
            );
            let verifiedEvent = tx.logs[0].event;
            let addedEvent = tx.logs[1].event;
            assert.equal(verifiedEvent, 'Verified', 'Verified event should be emitted');
            assert.equal(addedEvent, 'SolutionAdded', 'SolutionAdded event should be emitted');
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted', async function () {
            let error = false
            try {
                await this.contract.addSolution(
                    accounts[0],
                    1,
                    zkProof.proof.a,
                    zkProof.proof.b,
                    zkProof.proof.c,
                    zkProof.inputs
                );
                await this.contract.mint(accounts[0], 1);
            } catch (err) {
                error = true;
            }
            assert.equal(error, false, 'ERC721 should be minted');
        })
    });
})