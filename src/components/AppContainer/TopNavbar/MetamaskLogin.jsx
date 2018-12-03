import React, { Component } from 'react';

import { DrizzleContext } from 'drizzle-react';

import { Button } from '@material-ui/core';
import makeBlockie from 'ethereum-blockies-base64';

class MetamaskLogin extends Component {
  render() {
    return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return (
              <Button>
                Unlock
              </Button>
            );
          }

          const blockie = makeBlockie(drizzleState.accounts[0]);

          return (
            <Button>
              <img src={blockie} alt="blockie" style={{ borderRadius: '50%', width: '40px', height: '40px' }} />
            </Button>
          );
        }}
      </DrizzleContext.Consumer>
    );
  }
}

export default MetamaskLogin;
