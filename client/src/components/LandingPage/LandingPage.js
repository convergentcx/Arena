import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classes from './LandingPage.module.css';

class LandingPage extends Component {

    render() {
        return (
            <div className={classes.LandingPage}>
                <h1>
                    Unlock your personal economy.
                </h1>
                <h6>
                    Launch your own cryptocurrency within seconds and tokenize your future.
                </h6>
                <NavLink to={'/launch'}>
                    <Button color="warning"> Launch </Button>
                </NavLink>
                <NavLink to={{ hash: '#browse' }}>
                    <Button> Browse </Button>
                </NavLink>


            </div>
        );
    }
}

export default LandingPage;