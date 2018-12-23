import React from 'react';
// import styled from 'styled-components';
import { CssBaseline } from '@material-ui/core';

import Topbar from './Topbar';

// const Container = styled.div`
//   height: 100%'
//   marginBottom: 0;
//   min-height: 100vh;
//   padding: 0;
//   width: 100vw;
// `;

const AppContainer = props => (
  <div>
    <CssBaseline />
    <Topbar />
    {props.children}
  </div>
);

export default AppContainer;
