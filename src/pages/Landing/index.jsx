import React from 'react';
import { NavLink } from 'react-router-dom';
import TextLoop from 'react-text-loop';

import { Button, Typography, Tooltip } from '@material-ui/core';

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
  paddingTop: '2%'
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
    <Tooltip title="Not enabled, yet. Only selected economies on mainnet.">
      <Button size="large" variant="outlined" color="primary">
        Launch
      </Button>
    </Tooltip>
    &nbsp;&nbsp;
    <NavLink to={'/leaderboard'}>
      <Button color="secondary" size="large" variant="outlined">
        Browse Mainnet Economies
      </Button>
    </NavLink>
    <div style={{ position: 'fixed', bottom: 0 }}>
      <Typography variant="body2" color="primary.main">
        Check out the{' '}
        <a href="https://proto.convergent.cx" style={{ color: 'white' }}>
          {' '}
          Rinkeby testnet version{' '}
        </a>{' '}
        of this dapp.
      </Typography>
    </div>
  </div>
);

const Landing = () => (
  <div>
    <Hero />
  </div>
);

export default Landing;
