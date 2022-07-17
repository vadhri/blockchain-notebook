var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    var totalTokens = 10;

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            for (let i = 1; i <= totalTokens; i++) {
                await this.contract.mint(account_one, i);
            }
        })

        it('should return total supply', async function () { 
            assert.equal(await this.contract.totalSupply.call(), totalTokens, "total supply is not correct");
        })

        it('should get token balance', async function () { 
            let tokenBalance = await this.contract.balanceOf.call(account_one);
            assert.equal(tokenBalance, totalTokens, "balanceOf is not correct");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenUri = await this.contract.tokenURI.call(1);
            assert.equal(tokenUri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "token uri is not correct");

        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, 1);
            let newOwner = await this.contract.ownerOf(1);
            console.log("New owner of contract ->", newOwner);
            assert.equal(account_two, newOwner, "Token was not transfered");            
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let ret = false;
            try {
                await this.contract.mint(to, 100, { from: account_two });
            } catch {
                ret = true;
            }
            assert.equal(ret, true, "Cannot be minted by non contractowner");            
        })

        it('should return contract owner', async function () { 
            let currentOwner = await this.contract.contractOwner.call();
            assert.equal(currentOwner, account_one, "Owner is not correct");            
        })

    });
})