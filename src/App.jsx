import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './styles/App.css';

import Home from './components/Home/Home';
import LaunchToken from './components/LaunchToken/LaunchToken';
import Layout from './components/Layout/Layout';
import TokenDetails from './components/ListToken/TokenDetails/TokenDetails'; // probably should be renamed to TokenDetails

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
  <div className="App">
    <Layout>
      <Route path='/' component={Home} />
      <Switch>
        <Route path='/launch' component={LaunchToken} />
        <Route path='/tokens/:tokenAddress' exact component={TokenDetails} />
      </Switch>
    </Layout>
  </div>
);

export default App;
