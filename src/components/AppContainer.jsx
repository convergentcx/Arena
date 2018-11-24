import React from 'react';

import TopNavbar from './TopNavbar';

const AppContainer = props => (
  <div>
    <TopNavbar />
    <main>{props.children}</main>
  </div>
);

export default AppContainer;
