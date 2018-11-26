import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './styles/App.css';

import AppContainer from './components/AppContainer';

import Landing from './pages/Landing';
import Launch from './pages/Launch';
import Profile from './pages/Profile';

/**

import {
  Dashboard,
  Landing,
  Launch,
  Leaderboard,
  Profile,
} from './pages';

 */

const App = () => (
  <AppContainer>
    <Route path="/" component={Landing} />
    <Switch>
      <Route path="/launch" component={Launch} />
      <Route path="/tokens/:tokenAddress" exact component={Profile} />
    </Switch>
  </AppContainer>
);

export default App;
