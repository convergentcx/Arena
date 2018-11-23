import React, { Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
// import { Link } from 'react-router-dom';

import Logo from '../assets/logo.png';

export default class TopNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    return (
      <Navbar
        sticky={'top'}
        light
        expand="md"
        style={{
          paddingLeft: '100px',
          paddingRight: '100px'
        }}
      >
        <NavbarBrand
          href="/"
          style={{
            display: 'flex',
            width: '120px',
            justifyContent: 'space-around',
            alignContent: 'flex-start'
          }}
        >
          <img src={Logo} width="30" height="30" />
          <h3 style={{ alignSelf: 'flex-end' }}>Arena</h3>
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {/* <NavItem>
              <NavLink tag={Link} to="/about">
                About
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/">
                Browse
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/dashboard">
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>Chat</NavLink>
            </NavItem> */}
            <NavItem>
              <NavLink>Sign In</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
