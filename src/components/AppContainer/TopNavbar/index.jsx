import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import PropTypes from 'prop-types';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import {
  Button,
  AppBar,
  CssBaseline,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@material-ui/core';

import MetamaskLogin from './MetamaskLogin';

import Logo from '../../../assets/logo.png';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
    margin: 0,
    padding: 0,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
});

class PersistentDrawerLeft extends Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    const { anchorEl } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open
          })}
          elevation={3}
          color="primary"
          style={{ paddingLeft: '4%', paddingRight: '4%' }}
        >
          <Toolbar disableGutters={!open}>
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

PersistentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(PersistentDrawerLeft);