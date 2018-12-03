import React, { Component } from 'react';

import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  TextField
} from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';

import ipfsApi from 'ipfs-api';

import withContext from '../../hoc/withContext';

import { getBytes32FromMultihash } from '../../util';

import AttributeInput from './AttributeInput';

const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

class LaunchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ipfsUploading: false,
      rows: 0,
      stackId: null,
      tooFew: false,
      tooMany: false,
      tags: [],
      enteredTag: ''
    };
  }

  inputUpdate = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  addService = () => {
    this.state.rows === 2
      ? this.setState({ tooMany: true })
      : this.setState({ rows: this.state.rows + 1, tooFew: false });
  };

  removeService = () => {
    this.state.rows === 0
      ? this.setState({ tooFew: true })
      : this.setState({ rows: this.state.rows - 1, tooMany: false });
  };

  deploy = async () => {
    const {
      drizzle: {
        contracts: { PersonalEconomyFactory }
      },
      drizzleState
    } = this.props;

    const dataJson = {
      name: this.state.name,
      symbol: this.state.symbol,
      services: []
    };

    for (let i = 0; i <= this.state.rows; i++) {
      dataJson.services.push({ what: this.state[`service-${i}`], price: this.state[`price-${i}`] });
    }

    this.setState({ ipfsUploading: true });
    const ipfsHash = await this.submitHash(JSON.stringify(dataJson));
    this.setState({ ipfsUploading: false });

    const mhash = getBytes32FromMultihash(ipfsHash[0].path);
    const stackId = PersonalEconomyFactory.methods.create.cacheSend(
      mhash.digest,
      this.state.name,
      this.state.symbol,
      {
        from: drizzleState.accounts[0]
      }
    );
    this.setState({ stackId });
  };

  submitHash = async data => {
    const result = await ipfs.add(Buffer.from(data));
    return result;
  };

  waitUntilMined = () => {
    const { transactions, transactionStack } = this.props.drizzleState;
    const txHash = transactionStack[this.state.stackId];
    if (!txHash) return null;
    if (transactions[txHash].status === 'success') {
      setTimeout(() => this.props.history.push('/'), 1000);
    }
    return `Transaction status: ${transactions[txHash].status}`;
  };

  render() {
    let moreServices = [];

    const renderRows = () => {
      let i = 0;
      while (i < this.state.rows) {
        moreServices.push(
          <Grid container style={{ marginTop: '1vh' }}>
            <Grid item xs={9}>
              <TextField
                label="Service"
                type="text"
                name={`service-${i + 1}`}
                onChange={this.inputUpdate}
                style={{ width: '90%' }}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Price"
                type="text"
                name={`price-${i + 1}`}
                onChange={this.inputUpdate}
                style={{ width: '100%' }}
              />
            </Grid>

          </Grid>
        );
        i++;
      }
    };

    renderRows();

    return (
      <Card>
        <CardContent style={{ paddingLeft: '', paddingRight: '' }}>
          <Grid container>
            <Grid item sm={12} md={3} style={{ background: '' }}>
              <Avatar style={{ height: '200px', width: '200px', margin: 'auto' }}>
                Click to Upload
              </Avatar>
            </Grid>
            <Grid item sm={12} md={9}>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Name"
                  type="text"
                  name="name"
                  placeholder=""
                  onChange={this.inputUpdate}
                  style={{ width: '45%' }}
                />
                <TextField
                  required
                  label="Symbol"
                  type="text"
                  name="symbol"
                  placeholder=""
                  onChange={this.inputUpdate}
                  style={{ width: '45%', marginLeft: '10%' }}
                />
              </Grid>
              <Grid item xs={12} style={{ marginTop: '2vh' }}>
                <TextField
                  multiline
                  rows="3"
                  rowsMax="3"
                  variant="filled"
                  label="Description"
                  type="text"
                  name="description"
                  placeholder=""
                  // placeholder="Tell the market why your token will become valuable (you can also fill this in later)"
                  onChange={this.inputUpdate}
                  style={{ width: '100%' }}
                />
              </Grid>

              {/* <Grid item xs={12} style={{ marginTop: '2vh' }}>
                <AttributeInput />
              </Grid> */}
            </Grid>

            <Grid container style={{ marginTop: '40px' }}>

              <Grid item xs={9} style={{ paddingLeft: '' }}>
                <TextField
                  label="Service"
                  type="text"
                  name="service-0"
                  onChange={this.inputUpdate}
                  style={{ width: '90%' }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label="Price"
                  type="text"
                  name="price-0"
                  onChange={this.inputUpdate}
                  style={{ width: '100%' }}
                />
              </Grid>

            </Grid>

            {moreServices}

            <Grid item xs={12} style={{ display: 'flex', paddingLeft: '5vw', marginTop: '2vh' }}>
              <div style={{ flexGrow: 1 }} />
              <Button onClick={this.removeService}>
                <Remove />
              </Button>
              <Button onClick={this.addService}>
                <Add />
              </Button>
            </Grid>

            {/* Alerts */}
            <Grid item md={12} style={{ display: 'flex', justifyContent: 'center' }}>
              {this.state.tooMany && (
                <div color="warning" style={{ marginBottom: '' }}>
                  While we build{' '}
                  <span role="img" aria-label="emoji">
                    🛠
                  </span>{' '}
                  only 3 services will be available in your economy{' '}
                  <span role="img" aria-label="emoji">
                    💸
                  </span>
                </div>
              )}
              {this.state.tooFew && (
                <div color="warning" style={{ marginBottom: '' }}>
                  For your economy to work{' '}
                  <span role="img" aria-label="emoji">
                    👨‍💼
                  </span>{' '}
                  you need to offer at least one service{' '}
                  <span role="img" aria-label="emoji">
                    🗳
                  </span>
                </div>
              )}
            </Grid>
            
            {/* Deploy Button */}
            <Grid item md={12} style={{ display: 'flex', paddingLeft: '5vw', marginTop: '2vh' }}>
              <div style={{ flexGrow: 1 }} />
              <Button size="large" variant="outlined" onClick={this.deploy}>
                DEPLOY
              </Button>
            </Grid>

            <Grid item md={12} style={{ marginTop: '1vh' }}>
              {this.state.ipfsUploading && (
                <div style={{ width: '100%' }}>
                  <LinearProgress color="secondary" />
                  Uploading to IPFS!{' '}
                  <span role="img" aria-label="emoji">
                    📡
                  </span>
                </div>
              )}
              <div>{this.waitUntilMined()}</div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

const LaunchFormContextualized = withContext(LaunchForm);

const Launch = props => (
  <div style={{ padding: '10%' }}>
    <LaunchFormContextualized history={props.history} />
  </div>
);

export default Launch;
