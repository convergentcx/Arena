import React from 'react';
import { NavLink } from 'react-router-dom';
import TextLoop from 'react-text-loop';

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
  padding: '10%',
  paddingTop: '2%',
};

const Hero = () => (
  <div style={heroStyle}>
    <Typography variant="h3">Unlock your personal economy</Typography>
    <div style={{ height: '6%' }} />
    <Typography variant="h6">
      Launch your own cryptocurrency, tokenize your{' '}
      <TextLoop speed={2500}>
        <Typography variant="h6"> work.</Typography>
        <Typography variant="h6"> time.</Typography>
        <Typography variant="h6"> art.</Typography>
        <Typography variant="h6"> attention.</Typography>
        <Typography variant="h6"> future.</Typography>
        <Typography variant="h6"> influence.</Typography>
        <Typography variant="h6"> decisions.</Typography>
      </TextLoop>
    </Typography>
    <div style={{ height: '12%' }} />
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
