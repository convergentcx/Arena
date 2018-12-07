/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

/// Drizzle
import { Drizzle, generateStore } from 'drizzle';
import { DrizzleContext } from 'drizzle-react';

/// MUI Theme
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import { amber, green } from '@material-ui/core/colors';

const theme = createMuiTheme({"palette":{"common":{"black":"#000","white":"#fff"},"background":{"paper":"#fff","default":"rgba(231, 231, 231, 1)"},"primary":{"light":"rgba(144, 19, 254, 1)","main":"rgba(62, 62, 62, 1)","dark":"rgba(62, 0, 117, 1)","contrastText":"#fff"},"secondary":{"light":"rgba(74, 144, 226, 1)","main":"rgba(0, 109, 200, 1)","dark":"rgba(0, 50, 109, 1)","contrastText":"#fff"},"error":{"light":"#e57373","main":"#f44336","dark":"#d32f2f","contrastText":"#fff"},"text":{"primary":"rgba(0, 0, 0, 0.87)","secondary":"rgba(0, 0, 0, 0.54)","disabled":"rgba(0, 0, 0, 0.38)","hint":"rgba(0, 0, 0, 0.38)"}}});

/// Styles
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
