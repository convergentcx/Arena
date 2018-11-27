import React from 'react';
import { NavLink } from 'react-router-dom';

import { Button } from '@material-ui/core';

const heroStyle = {
  backgroundSize: 'cover',
  WebkitBackgroundSize: 'cover',
  MozBackgroundSize: 'cover',
  OBackgroundSize: 'cover',
  height: '90vh',
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
      <Button size="large" variant="outlined" style={{ color: '#000000', borderColor: '#0044FF'}}>
        Launch
      </Button>
    </NavLink>
    &nbsp;&nbsp;
    <NavLink to={'/leaderboard'}>
      <Button color='secondary' size="large" variant="outlined" style={{ color: '#000000' }}>
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
