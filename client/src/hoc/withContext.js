import React from 'react';
import { DrizzleContext } from 'drizzle-react';

const withContext = (WrappedComponent) =>  {

return(props) => (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return "Loading...";
          }

          return (
            <WrappedComponent {...props} drizzle={drizzle} drizzleState={drizzleState}/>
          );
        }}
      </DrizzleContext.Consumer>
    )
}
    
export default withContext;
