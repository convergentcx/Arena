import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { DrizzleContext } from 'drizzle-react';

import { Button, Grow, Grid, Tooltip, Typography } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import makeBlockie from 'ethereum-blockies-base64';

import { removeDecimals } from '../../../util';

const styles = theme => {
  let bg = '#464646';

  if (theme.palette.type === 'dark') {
    bg = '#FFFFFF'
  }

  return {
    arrowTool: {
      background: bg,
      padding: '5%',
      width: '250px'
    },
    arrowPopper: {
      '&[x-placement*="bottom"] $arrowArrow': {
        top: 0,
        left: 0,
        marginTop: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '0 1em 1em 1em',
          borderColor: `transparent transparent ${bg} transparent`,
        },
      },
      '&[x-placement*="top"] $arrowArrow': {
        bottom: 0,
        left: 0,
        marginBottom: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '1em 1em 0 1em',
          borderColor: `${bg} transparent transparent transparent`,
        },
      },
      '&[x-placement*="right"] $arrowArrow': {
        left: 0,
        marginLeft: '-0.9em',
        height: '3em',
        width: '1em',
        '&::before': {
          borderWidth: '1em 1em 1em 0',
          borderColor: `transparent ${bg} transparent transparent`,
        },
      },
      '&[x-placement*="left"] $arrowArrow': {
        right: 0,
        marginRight: '-0.9em',
        height: '3em',
        width: '1em',
        '&::before': {
          borderWidth: '1em 0 1em 1em',
          borderColor: `transparent transparent transparent ${bg}`,
        },
      },
    },
    arrowArrow: {
      position: 'absolute',
      fontSize: 7,
      width: '3em',
      height: '3em',
      '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        borderStyle: 'solid',
      },
    },
  }
};

class MetamaskLogin extends Component {
  state = {
    arrowRef: null,
  };

  handleArrowRef = node => {
    this.setState({
      arrowRef: node,
    });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return <Button>Unlock</Button>;
          }

          const blockie = makeBlockie(drizzleState.accounts[0]);

          const shortenAddress = address => (
            address.slice(0,8) + '...' + address.slice(-6)
          );

          let contrastText = '#FFFFFF';
          if (theme.palette.type === 'dark' ) {
            contrastText = '#232323';
          }

          const balance = drizzleState.accountBalances[drizzleState.accounts[0]];

          return (
            <Tooltip
              TransitionComponent={Grow}
              interactive
              placement="bottom-end"
              title={
                <React.Fragment>
                  <Grid container style={{ textAlign: 'center' }}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" style={{ color: contrastText, fontSize: '12px' }}>
                        {shortenAddress(drizzleState.accounts[0])}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" style={{ color: contrastText, fontSize: '14px' }}>
                        Balance: {removeDecimals(balance)} ETH
                      </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                      <Button color="secondary" variant="outlined">
                        DASHBOARD
                      </Button>
                    </Grid>
                  </Grid>
                  <span className={classes.arrowArrow} ref={this.handleArrowRef} />
                </React.Fragment>
              }
              classes={{ popper: classes.arrowPopper, tooltip: classes.arrowTool }}
              PopperProps={{
                popperOptions: {
                  modifiers: {
                    arrow: {
                      enabled: Boolean(this.state.arrowRef),
                      element: this.state.arrowRef,
                    },
                  },
                },
              }}
            >
              <NavLink to="/dashboard">
                <img
                  src={blockie}
                  alt="blockie"
                  style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                />
              </NavLink>
            </Tooltip>
          );
        }}
      </DrizzleContext.Consumer>
    );
  }
}

export default withTheme()(withStyles(styles)(MetamaskLogin));
