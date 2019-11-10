/*******************************************************************************
 * Copyright (C) 2019, Florian Mitterbauer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ******************************************************************************/

const assert = require("assert");
const MyCoin = artifacts.require("./MyCoin.sol");

contract("MyCoin", (accounts) => {
    const totalSupply = 1000000000;
    const owner = tronWeb.address.toHex(accounts[0]);
    const otherDude = tronWeb.address.toHex(accounts[1]);
    const thirdDude = tronWeb.address.toHex(accounts[2]);

    let coin;

    before(async function () {
        coin = await MyCoin.deployed()
        assert.ok(coin);
    })

    it("totalSupply should return correct total amount", async() => {
        const result = await coin.call('totalSupply');
        assert.ok(result);
        assert.equal(result, totalSupply);
    });

    it("balanceOf owner should have everything", async() => {
        const result = await coin.call('balanceOf', owner);
        assert.ok(result);
        assert.equal(result, totalSupply);
    });

    it("balanceOf someone who didn't use coins before, should have zero", async() => {
        const result = await coin.call('balanceOf', otherDude);
        assert.ok(result);
        assert.equal(result, 0);
    }); 

    it("allowance set allowance and check if the value is correct", async() => {
        let result = await coin.call('allowance', owner, otherDude);
        assert.ok(result);
        assert.equal(result, 0);
        
        const allowance = await coin.call('approve', otherDude, 100);

        result = await coin.call('allowance', owner, otherDude);
        assert.ok(result);
        assert.equal(result, 100);
    });

   
    it("approve allowance and let the spender use it to the max, should work", async() => {
        // create and check allowance
        const createAllowance = await coin.call('approve', otherDude, 100);
        const checkAllowance = await coin.call('allowance', owner, otherDude);
        assert.ok(checkAllowance);
        assert.equal(checkAllowance, 100);
       
        // the otherDude transferes the allowed amount from the owner to the thirdDude
        const result = await coin.call('transferFrom', owner, thirdDude, 100, {from: tronWeb.address.fromHex(otherDude)});
        assert.ok(result);

        // check that the allowance is used up and is zero
        result2 = await coin.call('allowance', owner, otherDude);
        assert.ok(result2);
        assert.equal(result2, 0);

        // check the outcome balance of the owner and the recipient, thirdDude
        const newOwnerBalance = await coin.call('balanceOf', owner);
        assert.ok(newOwnerBalance);
        assert.equal(newOwnerBalance, totalSupply - 100);
        const thirdDudeNewBalance = await coin.call('balanceOf', thirdDude);
        assert.ok(thirdDudeNewBalance);
        assert.equal(thirdDudeNewBalance, 100);

        // third dude gives back the money, so that the other tests can succeed
        const thirdDudeGivesMoneyBack = await coin.call('transfer', owner, 100, {from: tronWeb.address.fromHex(thirdDude)});
    });

    it("approve allowance and the spenders try to spend more than he's allowed to, do nothing", async() => {
        // create and check allowance
        const createAllowance = await coin.call('approve', otherDude, 100);
        const checkAllowance = await coin.call('allowance', owner, otherDude);
        assert.ok(checkAllowance);
        assert.equal(checkAllowance, 100);
       
        // the otherDude transferes the allowed amount from the owner to the thirdDude
        const result = await coin.call('transferFrom', owner, thirdDude, 101, {from: tronWeb.address.fromHex(otherDude)});
        assert.ok(result);

        // check that the allowance is still the same
        result2 = await coin.call('allowance', owner, otherDude);
        assert.ok(result2);
        assert.equal(result2, 100);

        // check the outcome balance is unchanged
        const newOwnerBalance = await coin.call('balanceOf', owner);
        assert.ok(newOwnerBalance);
        assert.equal(newOwnerBalance, totalSupply);
        const thirdDudeNewBalance = await coin.call('balanceOf', thirdDude);
        assert.ok(thirdDudeNewBalance);
        assert.equal(thirdDudeNewBalance, 0);
    });

    it("transfer from owner to otherDude more than the owner has, should do nothing", async() => {
        const result = await coin.call('transfer', otherDude, totalSupply + 1);
        assert.ok(result);
        
        const otherDudeNewBalance = await coin.call('balanceOf', otherDude);
        assert.ok(otherDudeNewBalance);
        assert.equal(otherDudeNewBalance, 0);

        const newOwnerBalance = await coin.call('balanceOf', owner);
        assert.ok(newOwnerBalance);
        assert.equal(newOwnerBalance, totalSupply);
    });

        
    it("transfer from owner to otherDude, should deduct from owner and add to otherDude", async() => {
        const result = await coin.call('transfer', otherDude, 100);
        assert.ok(result);
        
        const otherDudeNewBalance = await coin.call('balanceOf', otherDude);
        assert.ok(otherDudeNewBalance);
        assert.equal(otherDudeNewBalance, 100);

        const newOwnerBalance = await coin.call('balanceOf', owner);
        assert.ok(newOwnerBalance);
        assert.equal(newOwnerBalance, totalSupply - 100);
    }); 

   

});