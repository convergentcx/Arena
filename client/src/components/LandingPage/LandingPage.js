import React, { Component } from 'react';
import { Button, Jumbotron } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classes from './LandingPage.module.css';

class LandingPage extends Component {

    render() {
        return (
            <div className={classes.LandingPage}>
                  <Jumbotron>
                <h1 className="display-5">
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
            </Jumbotron>

            </div>
        );
    }
}

export default LandingPage;
