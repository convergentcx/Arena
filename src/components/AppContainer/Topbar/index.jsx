import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

// import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';

import Web3Panel from './Web3StatusBar';

import Logo from '../../../assets/logo.png';
// import WhiteLogo from '../../../assets/logo_white.png';

const Bar = styled.div`
  position: static;
  height: 30px;
  width: 100%;
  margin: 0;
  padding: 0 4% 0 4%;
  display: flex;
  flex-flow: row wrap;
  background: #c3c3c3;
`;

const Topbar = props => (
  <Bar>
    <NavLink to={'/'}>
      <img
        src={props.theme.palette.type === 'dark' ? Logo : Logo}
        alt="Convergent"
        width="25px"
        height="25px"
        style={{ paddingTop: '2.5px' }}
      />
    </NavLink>
    {/* &nbsp;&nbsp; */}
    {/* <Typography variant="h5" color="default" noWrap>
      Arena
    </Typography> */}
    <div style={{ flexGrow: 1 }} />
    <Web3Panel />
  </Bar>
);

export default withTheme()(Topbar);
