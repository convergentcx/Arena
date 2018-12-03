import React from 'react';

import TopNavbar from './TopNavbar';

const appStyles = {
  backgroundColor: '#232323',
  height: '100vh',
}

const AppContainer = props => (
  <div style={appStyles}>
    <TopNavbar content={props.children} />
  </div>
);

export default AppContainer;
