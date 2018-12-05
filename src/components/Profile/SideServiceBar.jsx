import React, { Component } from 'react';

import { Button, Paper } from '@material-ui/core';

export default class ServiceBar extends Component {
  constructor(props) {
    super(props);
    this.state = { interval: null, message: '', txStatus: null };
  } 

  render() {
    console.log(this.props.dataJson)
    const serviceBoxes = this.props.dataJson.services.map((serviceObj, i) => {
      return (
        <div>
          <h4>{serviceObj.what || 'Title'}</h4>
          <p>{serviceObj.price || 44}</p>
          <div>
            <Button
              color="secondary"
              // onClick=>
              >
              Request w ETH  
            </Button>
            <Button color="secondary">
              Request w {this.props.symbol} 
            </Button>
          </div>
        </div>
      );
    });

    return (
      <Paper square>
        <Paper square style={{ height: '5%', background: 'black', color: 'white' }}>
          My Services
        </Paper>
        {serviceBoxes}
      </Paper>
    )
  }
};
