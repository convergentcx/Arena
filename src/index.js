/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

/// Drizzle
import { Drizzle, generateStore } from 'drizzle';
import { DrizzleContext } from 'drizzle-react';

/// MUI Theme
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { amber, green } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: amber,
    secondary: green
  }
});

/// Styles
import './styles/index.css';

/// Our components
import App from './App';
import * as serviceWorker from './serviceWorker';

/// Contract artifacts
import PersonalEconomyFactory from './build/contracts/PersonalEconomyFactory.json';

const options = {
  contracts: [PersonalEconomyFactory]
};

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <DrizzleContext.Provider drizzle={drizzle}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DrizzleContext.Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
