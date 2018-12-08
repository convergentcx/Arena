import React, { Component } from 'react';
import { Button, CircularProgress, Grid, Paper, TextField, Typography } from '@material-ui/core';
import ipfsApi from 'ipfs-api';
const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

class Services extends Component {
  state = {
    jsonData: this.props.jsonData,
  };

  editServicesOrSave = async () => {
    if (this.state.editingServices) {
      // First save to IPFS
      const updatedServices = this.state.jsonData.services.map((serviceObj, index) => {
        let what, price;
        if (this.state[`service-${index}`] !== serviceObj.what) {
          what = this.state[`service-${index}`];
        }
        if (this.state[`price-${index}`] !== serviceObj.price) {
          price = this.state[`price-${index}`];
        }
        return { what: what || serviceObj.what, price: price || serviceObj.price };
      });

      const newDataJson = this.state.jsonData;
      delete newDataJson.services;
      newDataJson.services = updatedServices;

      this.setState({ loading: true, });
      await this.submitHash(JSON.stringify(newDataJson));
      this.setState({ loading: false, jsonData: newDataJson });
    }

    this.setState({ editingServices: !this.state.editingServices });
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
    let items = this.state.jsonData.services.map((serviceObj, i) => {
      return (
        <Grid container>
          <Grid item xs={9}>
            <TextField
              label={`Service`}
              name={`service-${i}`}
              defaultValue={serviceObj.what}
              onChange={this.handleChange}
              type="text"
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                readOnly: !this.props.editing
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label={`Price`}
              name={`price-${i}`}
              defaultValue={serviceObj.price}
              onChange={this.handleChange}
              type="number"
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                readOnly: !this.props.editing
              }}
            />
          </Grid>
        </Grid>
      );
    });

    return (
      <Paper style={{ display: 'flex', flexDirection: 'column' }}>
        <Grid container style={{ padding: '5%' }}>
          <Typography color="textSecondary" gutterBottom>
            Your Services
          </Typography>
          {this.props.loading 
            ? <Grid container style={{ height: '30vh', padding: '5%', textAlign: 'center' }}>
                <Grid item xs={12}>
                Saving to IPFS
                </Grid>
                <Grid item xs={12}>
                  <CircularProgress />
                </Grid>
              </Grid>
            : items
          }
        </Grid>
      </Paper>
    );
  }
}

export default Services;
