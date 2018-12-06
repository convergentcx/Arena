import React from 'react';

import TopNavbar from './TopNavbar';

const appStyles = {
  backgroundColor: '#232323',
  // height: '100%',
  minHeight: '100vh',
  padding: 0,
  marginBottom: 0
};

const AppContainer = props => (
  <div style={appStyles}>
    <TopNavbar content={props.children} />
  </div>
);

export default AppContainer;
