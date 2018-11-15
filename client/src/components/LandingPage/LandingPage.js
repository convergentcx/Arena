import React, { Component } from 'react';
import { Button, Jumbotron } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classes from './LandingPage.module.css';
import Background from '../../assets/curves.jpg'

class LandingPage extends Component {

    render() {

        let styles = {
            backgroundImage: "url(" + Background + ")",
            backgroundSize: 'cover',
            webkitBackgroundSize: 'cover',
            MozBackgroundSize: 'cover',
            oBackgroundSize: 'cover',
            height: '90vh',
            padding: '10%'
          };

        return (
            <div className={classes.LandingPage} style={styles}>
                <h1 className="display-4">
                    Unlock your personal economy.
                </h1>
                <br></br>

                <h5>
                    Launch your own cryptocurrency within seconds and tokenize your future.
                </h5>
                <br></br>
                <br></br>

                <NavLink to={'/launch'}>
                    <Button color="warning" size="lg"> Launch </Button>
                </NavLink>
                <NavLink to={{ hash: '#browse' }}>
                    <Button outline size="lg"> Browse </Button>
                </NavLink>

            </div>
        );
    }
}

export default LandingPage;
