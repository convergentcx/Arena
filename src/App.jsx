import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import AppContainer from './components/AppContainer';
import { Dashboard, Interface, Landing, Launch, Leaderboard, Profile } from './pages';

/// MUI Theme
import { MuiThemeProvider } from '@material-ui/core/styles';
import { kombatTheme, slateTheme } from './themes';

/// Notistack
import { SnackbarProvider } from 'notistack';
export default class App extends Component {
  state = {
    lights: false,
  };

  toggleLights = () => {
    this.setState({ lights: !this.state.lights });
  };

  render() {
    return (
      <SnackbarProvider
        maxSnack={6}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MuiThemeProvider theme={this.state.lights ? slateTheme : kombatTheme}>
          <AppContainer>
            <Switch>
              <Route path="/" exact component={Landing} />
              <Route path="/dashboard" exact component={Dashboard} />
              <Route
                path="/dashboard/:tokenAddress"
                exact
                render={props => (
                  <Interface
                    key={props.match.params.tokenAddress}
                    lights={this.state.lights}
                    toggleLights={this.toggleLights}
                  />
                )}
              />
              <Route path="/economies/:economyAddress" exact component={Profile} />
              <Route path="/launch" component={Launch} />
              <Route path="/leaderboard" component={Leaderboard} />
            </Switch>
          </AppContainer>
        </MuiThemeProvider>
      </SnackbarProvider>
    );
  }
}
