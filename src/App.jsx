import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { AppContainer, Dashboard } from './components';
import Interface from './components/Dashboard/DashboardInterface';
import { Landing, Launch, Leaderboard, Profile } from './pages';

import Dev from './Dev.jsx';

const App = () => (
  <AppContainer>
    <Switch>
      <Route path="/" exact component={Landing} />
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/dashboard/:tokenAddress" exact render={props => <Interface key={props.match.params.tokenAddress} />} />
      <Route path="/launch" component={Launch} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/economies/:economyAddress" exact component={Profile} />
      <Route path="/dev" exact component={Dev} />
    </Switch>
  </AppContainer>
);

export default App;
