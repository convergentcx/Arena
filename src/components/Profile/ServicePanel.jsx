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
        <div style={{minHeight: '30vh'}}>
          <Typography variant="h5" style={{ fontWeight: 'bold', color: 'primary' }}>
            {serviceObj.what || 'Title'}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ color: '#primary', fontSize: '14px', fontWeight: 'bold', marginTop: '6px' }}
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
        <Paper style={{ padding: '15px', display: 'flex', flexDirection: 'column' }}>
        {serviceBoxes}
        <Typography
                  variant="subtitle1"
                  style={{ color: 'primary', fontSize: '12px', fontWeight: 'bold' }}
                >
            my services
          </Typography>
      </Paper>
      



    );
  }
}
