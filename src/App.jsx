import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { AppContainer, Dashboard } from './components';
import Interface from './components/Dashboard/DashboardInterface';
import { Landing, Launch, Leaderboard, Profile } from './pages';

/// MUI Theme
import { MuiThemeProvider } from '@material-ui/core/styles';
import { hackerTheme, slateTheme } from './themes';

export default class App extends Component {
  state= {
    lights: true,
  }

  toggleLights = () => {
    this.setState({ lights: !this.state.lights });
  }

  render() {
    return (
    <MuiThemeProvider theme={this.state.lights ? slateTheme : hackerTheme}>
      <AppContainer>
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/dashboard" exact component={Dashboard} />
          <Route path="/dashboard/:tokenAddress" exact render={props => <Interface key={props.match.params.tokenAddress} lights={this.state.lights} toggleLights={this.toggleLights} />} />
          <Route path="/launch" component={Launch} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/economies/:economyAddress" exact component={Profile} />
        </Switch>
      </AppContainer>
    </MuiThemeProvider>
    )
  }
}
