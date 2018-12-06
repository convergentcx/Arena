import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './Sidebar.module.css';

export default class DashNav extends React.Component {
  render() {
    const links =
      this.props.tokens &&
      this.props.tokens.map(token => {
        return (
          <NavLink to={`/dashboard/${token.address}`} className={classes.NavHashLink}>
            {token.name}
          </NavLink>
        );
      });

    return (
      <div style={{ paddingTop: '20px' }}>
        <ul>{links}</ul>
      </div>
    );
  }
}
