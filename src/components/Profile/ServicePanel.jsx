import React, { Component } from 'react';

import { Button, Paper, TextField, Typography } from '@material-ui/core';

import { addDecimals, toBN } from '../../util';

export default class ServicePanel extends Component {
  constructor(props) {
    super(props);
    this.state = { interval: null, message: '', txStatus: null };
  }

  inputUpdate = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  requestETH = async (serviceObj, message) => {
    if (!message) {
      return alert('A message is required!');
    }

    const amountNeeded = await this.props.contract.methods.priceToMint(addDecimals(serviceObj.price)).call();
    // if (balanceOf(this.props.drizzleState.accounts[0]) < amountNeeded) {
    //   return alert("You don't have enough Ether to do this action!");
    // }
    console.log(this.props.drizzleState)
    return;

    const stackId = this.props.contract.methods.requestWithETH.cacheSend(`Service - ${serviceObj.what} | Message - ${message}`, addDecimals(serviceObj.price), {
      from: this.props.drizzleState.accounts[0],
      value: amountNeeded,
    });
    this.waitForMined(stackId);
  }

  request = async (serviceObj, message) => {
    if (!message) {
      return alert('A message is required!');
    }

    const requestorBalance = await this.props.contract.methods.balanceOf(this.props.drizzleState.accounts[0]).call();
    if (toBN(requestorBalance).lt(toBN(addDecimals(serviceObj.price)))) {
      return alert(`You don't have enough ${this.props.dataJson.symbol} to do this action!`);
    }

    const stackId = this.props.contract.methods.request.cacheSend(`Service - ${serviceObj.what} | Message - ${message}`, addDecimals(serviceObj.price), {
      from: this.props.drizzleState.accounts[0],
    });
    this.waitForMined(stackId);
  }

  waitForMined = stackId => { return alert(stackId); }

  render() {
    const serviceBoxes = this.props.dataJson.services.map((serviceObj, index) => {
      const { what, price } = serviceObj;
      return (
        <div style={{ textAlign: 'center', padding: '6px' }} key={index}>
          <Typography variant="h5" style={{ fontWeight: 'bold', color: '#052D49' }}>
            {what || 'Title'}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ color: '#4F687A', fontSize: '14px', fontWeight: 'bold', marginTop: '6px' }}
          >
            {price || 44} {this.props.dataJson.symbol}
          </Typography>
          <div style={{ height: '6px'}} />
          <TextField
            placeholder="Type your message here..."
            type="text"
            name={`message-${index}`}
            onChange={this.inputUpdate}
          />
          <div style={{ marginTop: '6px' }}>
            <Button color="secondary" size="small" onClick={() => this.requestETH(serviceObj, this.state[`message-${index}`])}>
              Request (ETH)
            </Button>
            <Button color="secondary" size="small" onClick={() => this.request(serviceObj, this.state[`message-${index}`])}>
              Request ({this.props.dataJson.symbol})
            </Button>
          </div>
        </div>
      );
    });

    return (
      <Paper>
        <Paper style={{ height: '5%', background: 'black', textAlign: 'center' }}>
          <Typography variant="h6" style={{ color: '#FFF' }}>
            Quick Services
          </Typography>
        </Paper>
        {serviceBoxes}
      </Paper>
      



    );
  }
}
