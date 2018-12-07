import React, { Component } from 'react';

import { Button, Paper, Typography } from '@material-ui/core';

export default class ServicePanel extends Component {
  constructor(props) {
    super(props);
    this.state = { interval: null, message: '', txStatus: null };
  }

  render() {
    const serviceBoxes = this.props.dataJson.services.map((serviceObj, i) => {
      return (
        <div style={{ textAlign: 'center', padding: '6px' }}>
          <Typography variant="h5" style={{ fontWeight: 'bold', color: '#052D49' }}>
            {serviceObj.what || 'Title'}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ color: '#4F687A', fontSize: '14px', fontWeight: 'bold', marginTop: '6px' }}
          >
            {serviceObj.price || 44} {this.props.symbol}
          </Typography>
          <div style={{ marginTop: '6px' }}>
            <Button color="secondary" size="small" onClick={() => {}}>
              Request (ETH)
            </Button>
            <Button color="secondary" size="small" onClick={() => {}}>
              Request ({this.props.symbol})
            </Button>
          </div>
        </div>
      );
    });

    return (
      <Paper square>
        <Paper square style={{ height: '5%', background: 'black', textAlign: 'center' }}>
          <Typography variant="h6" style={{ color: '#FFF' }}>
            Quick Services
          </Typography>
        </Paper>
        {serviceBoxes}
      </Paper>
    );
  }
}
