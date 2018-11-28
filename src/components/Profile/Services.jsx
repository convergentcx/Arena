import React, { Component } from 'react';

import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@material-ui/core';
import ipfsApi from 'ipfs-api';

import { getMultihashFromBytes32 } from '../../util';

const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

const multiplier = 10 ** 18;

export default class Services extends Component {
  constructor(props) {
    super(props);
    this.state = { jsonData: {}, message: '', stackId: '' };
  }

  async componentDidMount() {
    const contentAddress = getMultihashFromBytes32({
      digest: this.props.mhash,
      hashFunction: 18,
      size: 32
    });

    const result = await ipfs.get('/ipfs/' + contentAddress);
    const contentString = result[0].content.toString();
    const jsonData = JSON.parse(contentString);
    this.setState({
      jsonData
    });
  }

  inputUpdate = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
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
    this.setState({ stackId });
  };

  requestWithToken = serviceIndex => {
    const { contract, account } = this.props;
    const stackId = contract.methods.requestWithToken.cacheSend(this.state.message, {
      from: account
    });
    this.setState({ stackId });
  };

  render() {
    if (!this.state.jsonData.services) {
      return <div>Still Loading...</div>;
    }

    let items = this.state.jsonData.services.map((serviceObj, i) => {
      return (
        <TableRow key={i}>
          <TableCell>{serviceObj.what}</TableCell>
          <TableCell>{serviceObj.price}</TableCell>
          <TableCell>
            <TextField name="message" onChange={this.inputUpdate} />
          </TableCell>
          <TableCell>
            <Button color="danger" onClick={() => this.requestWithEth(i)}>
              Request with ETH
            </Button>
          </TableCell>
          <TableCell>
            <Button color="success" onClick={() => this.requestWithToken(i)}>
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
      </div>
    );
  }
}