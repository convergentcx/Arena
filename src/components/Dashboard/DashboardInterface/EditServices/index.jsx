import React, { Component } from 'react';
import { CircularProgress, Grid, Paper, TextField, Typography } from '@material-ui/core';

class Services extends Component {
  state = {
    dataJson: this.props.dataJson,
  };

  render() {
    let items = this.state.dataJson.services.map((serviceObj, index) => {
      return (
        <Grid container key={index}>
          <Grid item xs={9}>
            <TextField
              label={'Service'}
              name={`service-${index}`}
              defaultValue={serviceObj.what}
              onChange={this.props.handleChange}
              type="text"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: !this.props.editing,
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label={'Price'}
              name={`price-${index}`}
              defaultValue={serviceObj.price}
              onChange={this.props.handleChange}
              type="number"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: !this.props.editing,
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
          {this.props.loading ? (
            <Grid container style={{ height: '30vh', padding: '5%', textAlign: 'center' }}>
              <Grid item xs={12}>
                Saving to IPFS
              </Grid>
              <Grid item xs={12}>
                <CircularProgress />
              </Grid>
            </Grid>
          ) : (
            items
          )}
        </Grid>
      </Paper>
    );
  }
}

export default Services;
