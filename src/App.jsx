import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './styles/App.css';

import AppContainer from './components/AppContainer/AppContainer';

import Landing from './pages/Landing';
import Launch from './pages/Launch';
import Profile from './pages/Profile';
import Dashboard from './components/Dashboard/Dashboard';

import TokenDetails from './components/ListToken/TokenDetails/TokenDetails';
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
    <Switch>
      <Route path="/" exact component={Landing} />
      <Route path="/launch" component={Launch} />
      <Route path="/tokens/:tokenAddress" exact component={Profile} />
      <Route path="/dashboard" component={Dashboard} />
    </Switch>
  </AppContainer>
);

export default App;
