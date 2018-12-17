import React from "react";

import TopNavbar from "./TopNavbar";

const appStyles = {
  minHeight: "100vh",
  height: "100%",
  padding: 0,
  marginBottom: 0,
  width: "100vw"
};

const AppContainer = props => (
  <div style={appStyles}>
    <TopNavbar content={props.children} />
  </div>
);

export default AppContainer;
