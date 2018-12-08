/**
 * EditColumn handles the edit state of the lower components and 
 * the IPFS logic for submitting the new information to the network.
 */

import React, { Component } from 'react';
import { Button, CircularProgress, Grid, Paper, TextField, Typography } from '@material-ui/core';

import EditServices from '../EditServices';
import EditDetails from '../EditDetails';

import ipfsApi from 'ipfs-api';
const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

class EditColumn extends Component {
  state = {
    description: this.props.dataJson.description,
    editing: false,
    loading: false,
  }

  edit = () => {
    this.setState({ editing: !this.state.editing });
  }

  save = async () => {
    // First save to IPFS
    const updatedServices = this.props.dataJson.services.map((serviceObj, index) => {
      let what, price;
      if (this.state[`service-${index}`] !== serviceObj.what) {
        what = this.state[`service-${index}`];
      }
      if (this.state[`price-${index}`] !== serviceObj.price) {
        price = this.state[`price-${index}`];
      }
      return { what: what || serviceObj.what, price: price || serviceObj.price };
    });

    const newDataJson = this.props.dataJson;
    delete newDataJson.services;
    newDataJson.services = updatedServices;

    // update description if it changed
    if (this.props.dataJson.description !== this.state.description) {
      delete newDataJson.description;
      newDataJson.description = this.state.description;
    }

    this.setState({ loading: true, });
    await this.submitHash(JSON.stringify(newDataJson));
    this.setState({ editing: false, loading: false });
    this.props.updateData(newDataJson);

    // TODO, submit the hash to the chain
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  submitHash = async data => {
    const result = await ipfs.add(Buffer.from(data));
    return result;
  };

  render() {
    return (
      <div>
        <EditDetails jsonData={this.props.dataJson} />
        <EditServices
          editing={this.state.editing}
          handleChange={this.handleChange}
          loading={this.state.loading}
          dataJson={this.props.dataJson}
          account={this.props.drizzleState.accounts[0]}
          contract={this.props.contract}
          drizzleState={this.props.drizzleState}
          mhash={this.props.mhash}
          symbol={this.props.symbol}
        />
        <Paper style={{ marginTop: '16px', padding: '5%' }}>
            <Typography color="textSecondary" gutterBottom>
              Your Story
            </Typography>
            {this.state.loading
              ? <Grid container style={{ height: '', padding: '5%', textAlign: 'center' }}>
                  <Grid item xs={12}>
                    <CircularProgress />
                  </Grid>
                </Grid>
              : <TextField
                  name="description"
                  label="Description"
                  placeholder={this.state.description.slice(0, 27) + '...' || "My token will give you .."}
                  helperText="Tell your contributors why you are going to the moon"
                  fullWidth
                  multiline
                  rows="4"
                  margin="normal"
                  onChange={this.handleChange}
                  InputLabelProps={{
                    shrink: true
                  }}
                  InputProps={{
                    readOnly: !this.state.editing
                  }}
                />
            }
          </Paper>
          <Button
            variant="contained"
            color={this.state.editing ? 'primary' : 'secondary'} 
            style={{ width: '100%', marginTop: '16px' }}
            onClick={this.state.editing ? this.save : this.edit}
          >
            {this.state.editing ? 'SUBMIT TO CHAIN' : 'EDIT'}
          </Button>
      </div>
    )
  }
}

export default EditColumn;
