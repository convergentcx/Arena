# Arena (WIP)

This dapp allows users to easily create and interact with [personal economies](https://ipfs.io/ipfs/QmaWwL9MbaECKAvFwxX8cZaLpgbPKyqczqCW2DrjLQcJTF) within the [Convergent](https://convergent.cx/) ecosystem.

## Features

This is an MVP which will contain the essential features of a  personal economy platform: 

- display existing personal economies and offered services
- request offered services
- invest in existing personal economies
- customize and deploy your own personal economy (personal cryptocurrency + menu of services to back it with) 
- view your personal economy and investment portfolio in a dashboard
- chat with verified identities to transact service delivery

## Install

In the root directory as well as in the client directory, run:

```
npm install
```

Make sure you are installing openzeppelin-solidity version 1.12.0 (the next update will include openzeppelin 2.0).

Start ganache from the command line (alternatively using the UI application):
```
ganache-cli
```

Compile and deploy contracts:
```
truffle compile
truffle migrate --reset
```

## Run

Start the dapp from the client directory:
```
npm start
```
Connect MetaMask to your private ganache blockchain and import your account to make sure you have enough funds for transactions.

If re-deploying the contracts within the same dev session, you might have to reset your MetaMask account (click on the MetaMask extension, then on your account/gravatar, and then go all the way down to the second last button).