[![Build Status](https://travis-ci.org/convergentcx/Arena.svg?branch=master)](https://travis-ci.org/convergentcx/Arena)

# Arena (WIP)

Arena is the DApp component of the [Convergent](https://convergent.cx) ecosystem.
It facilitates the creation and discovery of [personal economies](https://ipfs.io/ipfs/QmYDfuvC5yDLSRJWcZNfVnSMLSBgPkaKoWjgEYKjwXZrA3).

## Features

This is an MVP which will contain the essential features of a  personal economy platform: 

- display existing personal economies and offered services
- request offered services
- invest in existing personal economies
- customize and deploy your own personal economy (personal cryptocurrency + menu of services to back it with) 
- view your personal economy and investment portfolio in a dashboard
- chat with verified identities to transact service delivery

## Install

First install dependencies and compile the contracts in the root directory.

```
$ yarn
```

Start ganache from the command line in one window (alternatively using the UI application):

```
$ yarn ganache
```

In another window run to compile and deploy the contracts:

```
$ yarn deploy:dev
```

## Run

```
$ yarn start
```

Connect MetaMask to your private ganache blockchain and import your account to make sure you have enough funds for transactions.

If re-deploying the contracts within the same dev session, you might have to reset your MetaMask account (click on the MetaMask extension, then on your account/gravatar, and then go all the way down to the second last button).
