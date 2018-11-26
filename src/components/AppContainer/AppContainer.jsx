import React from 'react';

import TopNavbar from './TopNavbar/TopNavbar';

const AppContainer = props => (
  <div>
    <TopNavbar content={props.children}/>
  </div>
);

export default AppContainer;
