import React, { Component } from 'react';

import { Button, Grid, TextField } from '@material-ui/core';

import { addDecimals, removeDecimals } from '../../util';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';
export default class BuyAndSellButtons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      interval: null,
      priceInEther: 0,
      rewardInEther: 0,
      txStatus: null
    };
  }

  buyHandler = () => {
    const buyStackId = this.props.contract.methods.mint.cacheSend(addDecimals(this.state.buyAmt), {
      from: this.props.drizzleState.accounts[0],
      value: this.state.priceInEther
    });
    this.waitForMined(buyStackId);
  };

  getStatus = txStackId => {
    const { transactions, transactionStack } = this.props.drizzleState;
    const txHash = transactionStack[txStackId];
    if (!txHash) return null;
    return transactions[txHash].status;
  };

  inputUpdate = async event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });

    // Update price
    if (name === 'buyAmt') {
      const priceInEther = await this.props.contract.methods.priceToMint(addDecimals(value)).call();
      this.setState({
        priceInEther
      });
    }

    // Update reward
    if (name === 'sellAmt') {
      const rewardInEther = await this.props.contract.methods
        .rewardForBurn(addDecimals(value))
        .call();
      this.setState({
        rewardInEther
      });
    }
  };

  sellHandler = () => {
    const sellStackId = this.props.contract.methods.burn.cacheSend(
      addDecimals(this.state.sellAmt),
      {
        from: this.props.drizzleState.accounts[0]
      }
    );
    this.waitForMined(sellStackId);
  };

  waitForMined = stackId => {
    const interval = setInterval(() => {
      const status = this.getStatus(stackId);
      if (status === 'pending' && this.state.txStatus !== 'pending') {
        toast.info('Waiting for transaction to be mined...', { className: 'blue-background' });
        this.setState({
          txStatus: 'pending'
        });
      }
      if (status === 'success' && this.state.txStatus !== 'success') {
        toast.success('Transaction mined!', { className: 'green-background' });
        clearInterval(this.state.interval);
        this.setState({
          txStatus: 'success'
        });
      }
    }, 100);
    this.setState({
      interval
    });
  };

  render() {
    return (
      <Grid container>
        <Grid item md={4}>
          <TextField
            type="number"
            name="buyAmt"
            onChange={this.inputUpdate}
            placeholder={this.props.symbol}
          />
          <div addonType="append">With {removeDecimals(this.state.priceInEther)} ETH</div>
        </Grid>

        <Grid item md={2}>
          <Button color="primary" onClick={this.buyHandler}>
            Buy
          </Button>
        </Grid>
        {/* <div>{this.getStatus('buyStackId')}</div> */}

        <Grid item md={4}>
          <TextField
            type="number"
            name="sellAmt"
            onChange={this.inputUpdate}
            placeholder={this.props.symbol}
          />
          <div addonType="append">For {removeDecimals(this.state.rewardInEther)} ETH</div>
        </Grid>

        <Grid item md={2}>
          <Button color="primary" onClick={this.sellHandler}>
            Sell
          </Button>
        </Grid>
        {/* <div>{this.getStatus('sellStackId')}</div> */}

        <ToastContainer autoClose={false} closeOnClick />
      </Grid>
    );
  }
}
