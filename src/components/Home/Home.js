import React from 'react';

import ListToken from '../ListToken/ListToken';
import LandingPage from '../LandingPage/LandingPage';
import About from '../About/About';
import Dashboard from '../Dashboard/Dashboard';
import { Route, Switch } from 'react-router-dom';

const home = () => (
    <div>
    <LandingPage/>
    <Switch>
    <Route path="/" exact component={ListToken}/>
    <Route path="/about" component={About}/>
    <Route path="/dashboard" component={Dashboard}/>
    </Switch>
    </div>
)

export default home