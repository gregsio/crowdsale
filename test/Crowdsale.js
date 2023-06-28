const { ethers } = require('hardhat'); 
const { expect } = require('chai');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Crowdsale', () => {
    let crowdsale, token, accounts

    beforeEach( async () => {
        const Crowdsale = await ethers.getContractFactory('Crowdsale')
        const Token = await ethers.getContractFactory('Token')

        accounts = await ethers.getSigners()
        deployer = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]

        token = await Token.deploy('SYZYGY','CZG', 1000000)
        crowdsale = await Crowdsale.deploy(token.address, ether(1), '1000000')

        let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(1000000))
        await transaction.wait()

        const dateInSecs = (Math.floor(new Date().getTime() / 1000) + 3600); // current date seconds + 1 hour
        transaction = await crowdsale.connect(deployer).crowndsaleClosingDate(dateInSecs)  // opens crowdsale for an hour
        result = await transaction.wait()

        transaction = await crowdsale.connect(deployer).whitelistAdd([user1.address])
        result = await transaction.wait()


    })

    describe('Deployment', () => {
        it('sends tokens to the Crowdsale contract', async () => {
            expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(1000000))
        })

        it('returns the Token contract address', async () => {
            expect(await crowdsale.token()).to.equal(token.address)
        })

        it('returns the price', async () => {
            expect(await crowdsale.price()).to.equal(ether(1))
        })

    })

    describe('Buying tokens', () => {
        let transaction, result, amount
        amount = tokens(10)
        describe('Sucess', () => {
            beforeEach( async () => {
                transaction = await crowdsale.connect(user1).buyTokens(amount, { value: ether(10)})
                result = await transaction.wait()
            })
            it('adds user to whitelist', async() =>{
                expect(await crowdsale.whitelist(user1.address)).to.equal(true)
            })
            it('transfers tokens', async () => {
                expect( await token.balanceOf(user1.address)).to.equal(amount)
                expect( await token.balanceOf(crowdsale.address)).to.equal(tokens(999990))
            })
            it('updates the contract ether balance', async () => {
                expect( await ethers.provider.getBalance(crowdsale.address)).to.equal(ether(10))
            })
            it('updates the tokenSold amount', async () => {
                expect( await crowdsale.tokenSold()).to.equal(amount)
            })
            it('emits a buy event', async () => {
                await expect(transaction).to.emit(crowdsale, 'Buy').withArgs(amount,user1.address)
            })
    
        })

        describe('Failure', () => {
            it('rejects buying tokens with insufficient ETH', async () => {
                await expect(crowdsale.connect(user1).buyTokens(tokens(10),{value: ether(0)})).to.be.reverted
            })
            it('rejects non-whitelisted users from buying tokens', async () => {
                await expect(crowdsale.connect(user2).buyTokens(tokens(10),{value: ether(10)})).to.be.revertedWith('Account is not whitelisted')
            })
            it('rejects users from buying token when crowsale is closed', async () => {
                const dateInSecs = (Math.floor(new Date().getTime() / 1000) - 3600); // current date seconds - 1 hour
                transaction = await crowdsale.connect(deployer).crowndsaleClosingDate(dateInSecs)  // closes the crowdsale an hour
                result = await transaction.wait()

                await expect(crowdsale.connect(user1).buyTokens(tokens(10),{value: ether(10)})).to.be.revertedWith('Crowdsale is closed')

            })
        })
    })

    describe('Sending ETH', () => {
        let transaction, result
        let amount = ether(10)
        describe('Sucess', () => {
            beforeEach( async () => {
                transaction = await user1.sendTransaction({to: crowdsale.address, value: amount})
                result = await transaction.wait()
            })
            it('updates contract Ether balance', async () => {
                expect( await ethers.provider.getBalance(crowdsale.address)).to.equal(amount)
            })
            it('updates user token balance', async () => {
                expect( await token.balanceOf(user1.address)).to.equal(amount)
            })
        })
    })

    describe('Updating token price', () => {
        let transaction, result
        let price = ether(0.5)

        beforeEach( async () => {
            transaction = await crowdsale.connect(deployer).setPrice(price)
            result = await transaction.wait()
        })

        describe('Sucess', async () => {    
            it('allows the owner to update the token price', async () => {
                expect(await crowdsale.price()).to.equal(price)
            })
        })
        describe('Failure', async () => {    
            it('prevent non-owner to update the token price', async () => {
                await expect(crowdsale.connect(user1).setPrice(price)).to.be.reverted
            })
        })
    })
    
    describe('Finalizing the sell', () =>{
        let transaction, result
        let amount = tokens(10)
        let value = ether(10)

        describe('Sucess', () => {
            beforeEach( async () => {
                transaction = await crowdsale.connect(user1).buyTokens(amount, { value: value })
                result = await transaction.wait()
                transaction = await crowdsale.connect(deployer).finalize()
                result = await transaction.wait()
            })

            it('transfers remaining tokens to owner', async () => {
                expect( await token.balanceOf(crowdsale.address)).to.equal(0)
                expect( await token.balanceOf(deployer.address)).to.equal(tokens(999990))
            })
            it('transfers ETH balance to owner', async () => {
                expect( await ethers.provider.getBalance(crowdsale.address)).to.equal(0)
            })
            it('emits a Finalize event', async () => {
                await expect(transaction).to.emit(crowdsale, 'Finalize').withArgs(amount, value)
            })
        })

        describe('Failure', () => {
            it('Prevents non-owner from finalizing', async() => {
                await expect(crowdsale.connect(user1).finalize()).to.be.reverted
            })
            
        })
    })


})    