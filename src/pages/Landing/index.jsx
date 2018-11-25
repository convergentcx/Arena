import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import { Button } from 'reactstrap';

import Leaderboard from '../Leaderboard';

import Background from '../../assets/curves.jpg';

const heroStyle = {
  backgroundImage: 'url(' + Background + ')',
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
    <h5>Launch your own cryptocurrency within seconds and tokenize your future.</h5>
    <br />
    <br />
    <NavLink to={'/launch'}>
      <Button color="warning" size="lg">
        Launch
      </Button>
    </NavLink>
    &nbsp;&nbsp;
    <NavLink to={{ hash: '#browse' }}>
      <Button outline size="lg">
        Browse
      </Button>
    </NavLink>
  </div>
);

const Landing = () => (
  <div>
    <Hero />
    <Switch>
      <Route path="/" exact component={Leaderboard} />
      {/* <Route path="/dashboard" component={Dashboard} /> */}
    </Switch>
  </div>
);

export default Landing;
