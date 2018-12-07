import React, { Component } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import ipfsApi from 'ipfs-api';
const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

class Services extends Component {
  state = {
    editingServices: false,
    jsonData: {},
    loading: false,
  };

  editServicesOrSave = () => {
    if (this.state.editingServices) {
      // First save to IPFS
      const oldDataJson = this.state.jsonData;
      const newDataJson = oldDataJson;
    }

    this.setState({ editingServices: !this.state.editingServices });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    let items = this.props.jsonData.services.map((serviceObj, i) => {
      return (
        <Grid container sm={12}>
          <Grid item sm={6}>
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
                readOnly: !this.state.editingServices
              }}
            />
          </Grid>
          <Grid item sm={6}>
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
                readOnly: !this.state.editingServices
              }}
            />
          </Grid>
        </Grid>
      );
    });

    return (
      <Paper style={{ display: 'flex', flexDirection: 'column' }}>
        <Grid container style={{ padding: '2%' }}>
          <Typography color="textSecondary" gutterBottom>
            Your Services
          </Typography>
          {this.state.loading ? 'loading' : items}
        </Grid>
        <Button
          variant="contained"
          color={this.state.editingServices ? 'primary' : 'secondary'}
          style={{ justifySelf: 'flex-end' }}
          onClick={this.editServicesOrSave}
        >
          {this.state.editingServices ? 'Save' : 'Edit'}
        </Button>
      </Paper>
    );
  }
}

export default Services;
