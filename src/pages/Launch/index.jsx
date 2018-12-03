import React, { Component } from 'react';
import { Alert } from 'reactstrap';

import { Button, Grid, LinearProgress, TextField, MenuItem } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import Chip from '@material-ui/core/Chip';

import shortid from 'shortid';

import ipfsApi from 'ipfs-api';

import withContext from '../../hoc/withContext';

import { getBytes32FromMultihash } from '../../util';

import ChipsArray from './Chips';

const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

// const categories = [
//   {
//     value: 'attention',
//     label: 'Attention'
//   },
//   {
//     value: 'media',
//     label: 'Media'
//   },
//   {
//     value: 'technology',
//     label: 'Technology'
//   },
//   {
//     value: 'arts',
//     label: 'Arts'
//   },
//   {
//     value: 'consulting',
//     label: 'Consulting'
//   },
//   {
//     value: 'mentorship',
//     label: 'Mentorship'
//   },
//   {
//     value: 'voting',
//     label: 'Voting Rights'
//   },
//   {
//     value: 'access',
//     label: 'Access Rights'
//   }
// ];

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

  onAddTag = e => {
    if (e.key === 'Enter') {
      this.setState({
        tags: [
          ...this.state.tags,
          {
            tag: e.target.value,
            id: shortid.generate()
          }
        ],
        enteredTag: ''
      });
    }
  };

  handleDeleteTag = id => {
    this.setState({ tags: this.state.tags.filter(tag => tag.id !== id) });
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
            <Grid item md={8}>
              <TextField
                label="Service"
                type="text"
                name={`service-${i + 1}`}
                onChange={this.inputUpdate}
              />
            </Grid>
            <Grid item md={4}>
              <TextField
                label="Price"
                type="text"
                name={`price-${i + 1}`}
                onChange={this.inputUpdate}
              />
            </Grid>
          </Grid>
        );
        i++;
      }
    };

    renderRows();

    return (
      <Grid container>
        <Grid item md={8} style={{}}>
          <Grid item md={12}>
            <TextField
              label="Name"
              type="text"
              name="name"
              placeholder=""
              onChange={this.inputUpdate}
              style={{width: '40%'}}
            />
            <TextField
              label="Symbol"
              type="text"
              name="symbol"
              placeholder=""
              onChange={this.inputUpdate}
              style={{width: '40%'}}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Tag"
              name="enteredTag"
              onKeyPress={this.onAddTag}
              onChange={this.inputUpdate}
              value={this.state.enteredTag}
              helperText="Hit enter to add"
            />
          </Grid>
        </Grid>

        <Grid item md={4} style={{}}>
          <Grid item md={12}>
            Photo
        </Grid>
          <Grid item md={12}>
            <div>
              {this.state.tags &&
                this.state.tags.map(tag => (
                  <Chip
                    key={tag.id}
                    label={tag.tag}
                    onDelete={() => this.handleDeleteTag(tag.id)}
                    color="secondary"
                  />
                ))}
            </div>
          </Grid>

        </Grid>


        <Grid item md={8}>
          <TextField label="Service" type="text" name="service-0" onChange={this.inputUpdate} />
        </Grid>
        <Grid item md={4}>
          <TextField label="Price" type="text" name="price-0" onChange={this.inputUpdate} />
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
