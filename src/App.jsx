import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './styles/App.css';

import {
  AppContainer,
  Dashboard,
} from './components';

import {
  Landing,
  Launch,
  Leaderboard,
  Profile,
} from './pages';


const App = () => (
  <AppContainer>
    <Switch>
      <Route path="/" exact component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/launch" component={Launch} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/tokens/:tokenAddress" exact component={Profile} />
    </Switch>
  </AppContainer>
);

export default App;
