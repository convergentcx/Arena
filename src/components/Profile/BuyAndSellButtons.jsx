import React, { Component } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import { withSnackbar } from 'notistack';

import { addDecimals, removeDecimals } from '../../util';

class BuyAndSellButtons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      interval: null,
      priceInEther: 0,
      rewardInEther: 0,
      txStatus: null,
    };
  }

  buyHandler = () => {
    if (!this.state.buyAmt) {
      return;
    }

    const buyStackId = this.props.contract.methods.buy.cacheSend(addDecimals(this.state.buyAmt), {
      from: this.props.drizzleState.accounts[0],
      value: this.state.priceInEther,
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
      [name]: value,
    });

    // Update price
    if (name === 'buyAmt') {
      let priceInEther = 0;
      if (Number(value) !== 0) {
        priceInEther = await this.props.contract.methods.price(addDecimals(value)).call();
      }
      this.setState({
        priceInEther,
      });
    }

    // Update reward
    if (name === 'sellAmt') {
      let rewardInEther = 0;
      if (Number(value) !== 0) {
        rewardInEther = await this.props.contract.methods.reward(addDecimals(value)).call();
      }
      this.setState({
        rewardInEther,
      });
    }
  };

  sellHandler = () => {
    if (!this.state.sellAmt) {
      return;
    }

    const sellStackId = this.props.contract.methods.sell.cacheSend(
      addDecimals(this.state.sellAmt),
      {
        from: this.props.drizzleState.accounts[0],
      }
    );
    this.waitForMined(sellStackId);
  };

  waitForMined = stackId => {
    const { enqueueSnackbar } = this.props;
    const interval = setInterval(() => {
      const status = this.getStatus(stackId);
      if (status === 'pending' && this.state.txStatus !== 'pending') {
        enqueueSnackbar('Waiting for transaction to be mined...');
        this.setState({
          txStatus: 'pending',
        });
      }
      if (status === 'success' && this.state.txStatus !== 'success') {
        enqueueSnackbar('Transaction mined!', { variant: 'success' });
        clearInterval(this.state.interval);
        this.setState({
          txStatus: 'success',
        });
      }
    }, 100);
    this.setState({
      interval,
    });
  };

  render() {
    return (
      <Grid container>
        <Grid
          item
          md={6}
          style={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            padding: '5%',
          }}
        >
          <TextField
            type="number"
            variant="outlined"
            name="buyAmt"
            onChange={this.inputUpdate}
            placeholder={this.props.symbol}
            helperText={`With ${removeDecimals(this.state.priceInEther)} ETH`}
          />
          &nbsp;&nbsp;
          <Button
            color="secondary"
            variant="contained"
            onClick={this.buyHandler}
            style={{ height: '100%' }}
          >
            Buy
          </Button>
        </Grid>

        <Grid
          item
          md={6}
          style={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            padding: '5%',
          }}
        >
          <TextField
            type="number"
            variant="outlined"
            name="sellAmt"
            onChange={this.inputUpdate}
            placeholder={this.props.symbol}
            helperText={`For ${removeDecimals(this.state.rewardInEther)} ETH`}
          />
          &nbsp;&nbsp;
          <Button
            color="secondary"
            variant="contained"
            onClick={this.sellHandler}
            style={{ height: '100%' }}
          >
            Sell
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default withSnackbar(BuyAndSellButtons);
