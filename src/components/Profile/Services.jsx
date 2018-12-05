import React, { Component } from 'react';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';

const multiplier = 10 ** 18;

export default class Services extends Component {
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

  getStatus = txStackId => {
    const { transactions, transactionStack } = this.props.drizzleState;
    const txHash = transactionStack[txStackId];
    if (!txHash) return null;
    return transactions[txHash].status;
  };

  requestWithEth = serviceIndex => {
    const { contract, account } = this.props;
    const stackId = contract.methods.requestWithEth.cacheSend(
      this.state.message,
      String(this.state.jsonData.services[serviceIndex].price * multiplier),
      {
        from: account
        // value: this.state.jsonData.services[serviceIndex].price * multiplier,
      }
    );
    this.waitForMined(stackId);
  };

  requestWithToken = serviceIndex => {
    const { contract, account } = this.props;
    const stackId = contract.methods.requestWithToken.cacheSend(this.state.message, {
      from: account
    });
    this.waitForMined(stackId);
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
    if (!this.props.dataJson) {
      return <div>Still Loading...</div>;
    }

    const items = this.props.dataJson.services.map((serviceObj, i) => {
      return (
        <TableRow key={i}>
          <TableCell>{serviceObj.what}</TableCell>
          <TableCell>{serviceObj.price}</TableCell>
          <TableCell>
            <TextField name="message" onChange={this.inputUpdate} />
          </TableCell>
          <TableCell>
            <Button color="secondary" onClick={() => this.requestWithEth(i)}>
              Request with ETH
            </Button>
          </TableCell>
          <TableCell>
            <Button color="primary" onClick={() => this.requestWithToken(i)}>
              Request with {this.props.symbol}
            </Button>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Message</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>{items}</TableBody>
        </Table>

        <ToastContainer autoClose={false} closeOnClick />
      </div>
    );
  }
}
