const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'call glow rt', 
    'https://rinkeby.infura.io/v3/1169d54f24964d03bbe5264bd501e47f'
)

const web3 = new Web3(provider);