const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface, bytecode } = require('../compile') 


class Car { 
    park () {
        return 'stopped';
    }

    drive() {
        return 'vroom';
    } 
}

let accounts;

beforeEach(async ()=>{
    // get list of accounts
    accounts = await web3.eth.getAccounts()

    // use one of those accounts to deploy

    
});

describe('EthPolynomialCurvedToken', ()=> {
    it('deploys a contract', () => {
        console.log(accounts);
    });

});