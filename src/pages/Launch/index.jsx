import React, { Component } from 'react';

import { Card, Grid, TextField } from '@material-ui/core';
import dataUriToBuffer from 'data-uri-to-buffer';
import ipfsApi from 'ipfs-api';
import { withSnackbar } from 'notistack';
import StepWizard from 'react-step-wizard';
import Welcome from './Steps/Step1';
import NamePhoto from './Steps/Step2';
import Description from './Steps/Step3';
import Services from './Steps/Step4';
import Review from './Steps/Step5';
import withContext from '../../hoc/withContext';
import { withRouter } from 'react-router-dom';

import { getBytes32FromMultihash } from '../../util';

const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

// to prevent default transitions of StepWizard:
let custom = {
  enterRight: 'your custom css transition classes',
  enterLeft: 'your custom css transition classes',
  exitRight: 'your custom css transition classes',
  exitLeft: 'your custom css transition classes'
};

class LaunchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: '',
      ipfsUploading: false,
      rows: 0,
      stackId: null,
      tooFew: false,
      tooMany: false,
      tags: [],
      enteredTag: '',
      description: 'I am XYZ and this token shall represent the value of my %3@#...',
      'price-0': 1
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

    // Check for all the required fields.
    if (!this.state.name || !this.state.symbol || !this.state['service-0']) {
      return alert('Please fill in the required data fields: name, symbol, (at least 1) service');
    }

    let imgBuf = '';
    try {
      imgBuf = dataUriToBuffer(this.state.file);
    } catch (e) {
      // console.error(e);
    }

    const dataJson = {
      name: this.state.name,
      description: this.state.description || '',
      image: imgBuf,
      symbol: this.state.symbol,
      tags: this.state.selectedItems,
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
    this.waitForMined(stackId);
  };

  onDrop = files => {
    const reader = new FileReader();
    reader.onload = e => {
      this.setState({
        file: e.target.result
      });
    };

    reader.readAsDataURL(files[0]);
  };

  submitHash = async data => {
    const result = await ipfs.add(Buffer.from(data));
    return result;
  };

  getStatus = txStackId => {
    const { transactions, transactionStack } = this.props.drizzleState;
    const txHash = transactionStack[txStackId];
    if (!txHash) return null;
    return transactions[txHash].status;
  };

  waitForMined = stackId => {
    const { enqueueSnackbar } = this.props;
    const interval = setInterval(() => {
      const status = this.getStatus(stackId);
      if (status === 'pending' && this.state.txStatus !== 'pending') {
        enqueueSnackbar('Waiting for transaction to be mined...');
        this.setState({
          txStatus: 'pending'
        });
      }
      if (status === 'success' && this.state.txStatus !== 'success') {
        enqueueSnackbar('Transaction mined!', { variant: 'success' });
        clearInterval(this.state.interval);
        this.setState({
          txStatus: 'success'
        });
        setTimeout(() => {
          this.props.history.push('/leaderboard');
        }, 2000);
      }
    }, 100);
    this.setState({
      interval
    });
  };

  getSelectedTags = selectedItems => {
    this.setState({ selectedItems });
  };

  cancel = () => {
    this.props.history.push('/');
  };

  render() {
    let moreServices = [];
    (() => {
      let i = 0;
      while (i < this.state.rows) {
        moreServices.push(
          <Grid container style={{ marginTop: '1vh' }}>
            <Grid item xs={10}>
              <TextField
                label="Service"
                type="text"
                name={`service-${i + 1}`}
                onChange={this.inputUpdate}
                fullWidth
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                label={`Price (${this.state.symbol})`}
                type="text"
                name={`price-${i + 1}`}
                onChange={this.inputUpdate}
                style={{ marginLeft: '30px' }}
              />
            </Grid>
          </Grid>
        );
        i++;
      }
    })();

    return (
      <Card>
        <StepWizard transitions={custom}>
          <Welcome cancel={this.cancel} />
          <NamePhoto
            cancel={this.cancel}
            inputUpdate={this.inputUpdate}
            onDrop={this.onDrop}
            file={this.state.file}
          />
          <Description
            cancel={this.cancel}
            inputUpdate={this.inputUpdate}
            getSelectedTags={this.getSelectedTags}
            description={this.state.description}
          />
          <Services
            cancel={this.cancel}
            inputUpdate={this.inputUpdate}
            addService={this.addService}
            removeService={this.removeService}
            moreServices={moreServices}
            tooMany={this.state.tooMany}
            tooFew={this.state.tooFew}
            symbol={this.state.symbol}
            price0={this.state['price-0']}
          />
          <Review
            cancel={this.cancel}
            deploy={this.deploy}
            ipfsUploading={this.state.ipfsUploading}
            symbol={this.state.symbol}
            name={this.state.name}
            description={this.state.description}
            tags={this.state.tags}
          />
        </StepWizard>
      </Card>
    );
  }
}

const LaunchFormContextualized = withSnackbar(withContext(withRouter(LaunchForm)));

const Launch = props => (
  <div style={{ padding: '10%', paddingTop: '5%' }}>
    <LaunchFormContextualized history={props.history} />
  </div>
);

export default Launch;
