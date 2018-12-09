import React from 'react';
import { NavLink } from 'react-router-dom';

import { Button, Typography } from '@material-ui/core';

const heroStyle = {
  backgroundSize: 'cover',
  // background: '#FFFFFF',
  // color: '#FFFFFF',
  WebkitBackgroundSize: 'cover',
  MozBackgroundSize: 'cover',
  OBackgroundSize: 'cover',
  height: '100vh',
  margin: '0',
  paddingLeft: '4%',
  paddingTop: '30%'
};

const Hero = () => (
  <div style={heroStyle}>
    <Typography variant="h3" color="common">Unlock your personal economy</Typography>
    <br />
    <Typography variant="h6" color="common">Launch your own cryptocurrency and tokenize your work.</Typography>
    <br />
    <br />
    <NavLink to={'/launch'}>
      <Button size="large" variant="outlined" color="primary">
        Launch
      </Button>
    </NavLink>
    &nbsp;&nbsp;
    <NavLink to={'/leaderboard'}>
      <Button color="secondary" size="large" variant="outlined">
        Browse
      </Button>
    </NavLink>
  </div>
);

const Landing = () => (
  <div>
    <Hero />
  </div>
);

export default Landing;
