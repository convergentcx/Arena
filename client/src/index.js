import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";
import MyTokenFactory from "./contracts/MyTokenFactory.json";


// let drizzle know what contracts we want
const options = { contracts: [MyTokenFactory] };

// setup the drizzle store and drizzle
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(
    <DrizzleContext.Provider drizzle={drizzle}>
	<BrowserRouter>
        <App />
	</BrowserRouter>
    </DrizzleContext.Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
