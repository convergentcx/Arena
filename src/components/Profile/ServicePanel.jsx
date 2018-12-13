import React, { Component } from 'react';
import { Button, Paper, TextField, Typography } from '@material-ui/core';
import { withSnackbar } from 'notistack';

import { addDecimals, toBN } from '../../util';

class ServicePanel extends Component {

  render() {
    const serviceBoxes = this.props.dataJson.services.map((serviceObj, index) => {
      const { what, price } = serviceObj;
      return (
        <div key={index}>
          <Typography variant="h5" style={{ fontWeight: 'bold', color: 'primary' }}>
            {what || 'Title'}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ color: '#primary', fontSize: '14px', fontWeight: 'bold', marginTop: '6px' }}
          >
            {price || 44} {this.props.dataJson.symbol}
          </Typography>
          <hr />
        </div>
      );
    });

    return (
      <Paper style={{ padding: '15px', display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="subtitle1"
          style={{ color: 'primary', fontSize: '12px', fontWeight: 'bold' }}
        >
          service overview
        </Typography>
        {serviceBoxes}
      </Paper>
    );
  }
}

export default withSnackbar(ServicePanel);
