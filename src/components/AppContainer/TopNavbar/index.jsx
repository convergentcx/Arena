import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import {
  AppBar,
  CssBaseline,
  Toolbar,
  Typography
} from '@material-ui/core';

import MetamaskLogin from './MetamaskLogin';

import Logo from '../../../assets/logo.png';

export default class TopNav extends Component {
  render() {
    return (
      <div>
        <CssBaseline />
        <AppBar
          position="static"
          elevation={3}
          color="primary"
          style={{ paddingLeft: '4%', paddingRight: '4%', height: '7vh' }}
        >
          <Toolbar>
            <NavLink to={'/'}>
              <img src={Logo} alt="Convergent" width="40px" height="40px" />
            </NavLink>
            &nbsp;&nbsp;
            <Typography variant="h5" color="inherit" noWrap>
              Arena
            </Typography>
            <div style={{ flexGrow: 1 }} />
            <MetamaskLogin />
          </Toolbar>
        </AppBar>
        <main>
          <div>{this.props.content}</div>
        </main>
      </div>
    );
  }
}
