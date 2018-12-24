/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
// import { HashRouter } from 'react-router-dom';

/// Drizzle
import { Drizzle, generateStore } from 'drizzle';
import { DrizzleContext } from 'drizzle-react';

/// Redux
import { Provider } from 'react-redux';
import { history, store } from './store';

/// Styles
import './styles/index.css';

/// Our components
import App from './App';
import * as serviceWorker from './serviceWorker';

/// Contract artifacts
import PersonalEconomyFactory from './build/contracts/PersonalEconomyFactory.json';

const options = {
  contracts: [PersonalEconomyFactory],
};

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(
  <DrizzleContext.Provider drizzle={drizzle}>
    <Provider store={store}>
      <App history={history} />
    </Provider>
  </DrizzleContext.Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
