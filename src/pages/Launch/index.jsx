import React, { Component } from 'react';
import { Alert } from 'reactstrap';

import { Button, Grid, LinearProgress, TextField, Card, CardContent, CardHeader, Avatar, Divider } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';

import ipfsApi from 'ipfs-api';

import withContext from '../../hoc/withContext';

import { getBytes32FromMultihash } from '../../util';

import DownshiftMultiple from './Chips';

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
          <Grid container>
            <Grid item md={3}>
              <TextField
                label="Price"
                type="text"
                name={`price-${i + 1}`}
                onChange={this.inputUpdate}
                style={{ width: '80%' }}
              />
            </Grid>
            <Grid item md={9} style={{ paddingLeft: '10px' }}>
              <TextField
                label="Service"
                type="text"
                name={`service-${i + 1}`}
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
        <CardContent style={{ paddingLeft: '5%', paddingRight: '5%' }}>

          <Grid container>
            <Grid item md={3} style={{ textAlign: 'center' }}>
              <div>
                <Avatar style={{ height: '200px', width: '200px', marginTop: '10px' }}>S</Avatar>
              </div>
            </Grid>
            <Grid item md={9} style={{ paddingLeft: '10px' }}>
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
              <Grid item md={12}>

                <TextField
                  id="standard-full-width"
                  value={this.state.multiline}
                  onChange={this.inputChange}
                  label="Description"
                  name="description"
                  style={{ width: '100%' }}
                  placeholder="Tell the market why your token will become valuable (you can also fill this in later)"
                  multiline
                  rows="4"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              <Grid item md={12}>
                <DownshiftMultiple />
              </Grid>
            </Grid>

            <Grid container style={{ marginTop: '80px' }}>

              <Grid item md={3}>
                <TextField label="Price" type="text" name="price-0" onChange={this.inputUpdate} style={{ width: '80%' }} />
              </Grid>

              <Grid item md={9} style={{ paddingLeft: '10px' }}>
                <TextField label="Service" type="text" name="service-0" onChange={this.inputUpdate} style={{ width: '100%' }} />
              </Grid>

            </Grid>
            {moreServices}
            <Grid item md={12}>
              <Button onClick={this.removeService}>
                <Remove />
              </Button>
              <Button onClick={this.addService}>
                <Add />
              </Button>
            </Grid>
            <br />
            <Grid item md={12}>
              {this.state.tooMany && (
                <Alert color="warning" style={{ marginBottom: '10px' }}>
                  While we build 🛠 only 3 services will be available in your economy 💸
            </Alert>
              )}
              {this.state.tooFew && (
                <Alert color="warning" style={{ marginBottom: '10px' }}>
                  For your economy to work 👨‍💼 you need to offer at least one service 🗳
            </Alert>
              )}
            </Grid>
            <Grid item md={12}>
              <Button size="medium" variant="outlined" onClick={this.deploy}>
                Deploy
              </Button>
            </Grid>
            <br />
            {this.state.ipfsUploading && (
              <div>
                <LinearProgress color="secondary" />
                Uploading to IPFS! 📡
            </div>
            )}
            <div>{this.waitUntilMined()}</div>
          </Grid>
        </CardContent>
      </Card >
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
