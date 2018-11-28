import React, { Component } from 'react';

import {
  Button,
  Grid,
  TextField,
} from '@material-ui/core';

const multiplier = 10 ** 18;

export default class BuyAndSellButtons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      priceInEther: 0,
      rewardInEther: 0
    };
  }

  buyHandler = () => {
    const buyStackId = this.props.contract.methods.mint.cacheSend(String(10 ** 18), {
      from: this.props.drizzleState.accounts[0],
      value: String(this.state.priceInEther)
    });
    this.setState({ buyStackId });
  };

  getStatus = txStackId => {
    const { transactions, transactionStack } = this.props.drizzleState;
    const txHash = transactionStack[this.state[txStackId]];
    if (!txHash) return null;
    return `Transaction status: ${transactions[txHash].status}`;
  };

  inputUpdate = async event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });

    // Update price
    if (name === 'buyAmt') {
      const priceInEther = await this.props.contract.methods.priceToMint(String(10 ** 18)).call();
      this.setState({
        priceInEther
      });
    }

    // Update reward
    if (name === 'sellAmt') {
      const rewardInEther = await this.props.contract.methods
        .rewardForBurn(String(10 ** 18))
        .call();
      this.setState({
        rewardInEther
      });
    }
  };

  sellHandler = () => {
    const sellStackId = this.props.contract.methods.burn.cacheSend(String(10 ** 18), {
      from: this.props.drizzleState.accounts[0]
    });
    this.setState({ sellStackId });
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
          <div addonType="append">
            With {(this.state.priceInEther / multiplier).toFixed(3)} ETH
          </div>
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
          <div addonType="append">
            For {(this.state.rewardInEther / multiplier).toFixed(3)} ETH
          </div>
        </Grid>

        <Grid item md={2}>
          <Button color="primary" onClick={this.sellHandler}>
            Sell
          </Button>
        </Grid>
        {/* <div>{this.getStatus('sellStackId')}</div> */}

      </Grid>
    );
  }
}
