import React from "react";
import { DrizzleContext } from "drizzle-react";

const withContext = WrappedComponent => props => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;

      if (!initialized) {
        return "Loading...";
        // TODO: Convergent branded loading page based on the one in billboard.
      }

      return (
        <WrappedComponent
          {...props}
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
      );
    }}
  </DrizzleContext.Consumer>
);

export default withContext;
