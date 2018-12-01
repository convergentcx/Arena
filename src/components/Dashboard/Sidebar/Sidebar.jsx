import React from 'react';
import { Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import classes from './Sidebar.module.css';

export default class Example extends React.Component {
  render() {
    const links =
      this.props.tokens &&
      this.props.tokens.map(token => {
        return (
          // <NavLink to={`/dashboard/#${token.address}`}>{token.name}</NavLink>
          <NavLink to={`/dashboard/${token.address}`} className={classes.NavHashLink}>
            {token.name}
          </NavLink>
        );
      });

    return (
      <div>
        <Nav>{links}</Nav>
      </div>
    );
  }
}
