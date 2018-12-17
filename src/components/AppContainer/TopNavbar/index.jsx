import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import { withTheme } from "@material-ui/core/styles";

import { AppBar, CssBaseline, Toolbar, Typography } from "@material-ui/core";

import MetamaskLogin from "./MetamaskLogin";

import Logo from "../../../assets/logo.png";
import WhiteLogo from "../../../assets/logo_white.png";

class TopNav extends Component {
  render() {
    return (
      <div>
        <CssBaseline />
        <AppBar
          position="static"
          elevation={3}
          color="inherit"
          style={{ paddingLeft: "4%", paddingRight: "4%" }}
        >
          <Toolbar>
            <NavLink to={"/"}>
              <img
                src={
                  this.props.theme.palette.type === "dark" ? WhiteLogo : Logo
                }
                alt="Convergent"
                width="40px"
                height="40px"
              />
            </NavLink>
            &nbsp;&nbsp;
            <Typography variant="h5" color="default" noWrap>
              Arena
            </Typography>
            <div style={{ flexGrow: 1 }} />
            <MetamaskLogin />
          </Toolbar>
        </AppBar>
        <main>
          <div>{this.props.content}</div>
        </main>
      </div>
    );
  }
}

export default withTheme()(TopNav);
