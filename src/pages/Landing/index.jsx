import React from 'react';
import { NavLink } from 'react-router-dom';

import { Button } from '@material-ui/core';

const heroStyle = {
  backgroundSize: 'cover',
  // background: '#FFFFFF',
  // color: '#FFFFFF',
  WebkitBackgroundSize: 'cover',
  MozBackgroundSize: 'cover',
  OBackgroundSize: 'cover',
  height: '100vh',
  margin: '0',
  padding: '10%'
};

const Hero = () => (
  <div style={heroStyle}>
    <h1 className="display-4">Unlock your personal economy</h1>
    <br />
    <h5>Launch your own cryptocurrency, tokenize your future, and regain your freedom.</h5>
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
