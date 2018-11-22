import React, { Component } from 'react';
import './App.css';
import Home from "./components/Home/Home";
import LaunchToken from "./components/LaunchToken/LaunchToken";
import TokenDetails from "./components/ListToken/TokenDetails/TokenDetails" // probably should be renamed to TokenDetails
import { Route, Switch } from 'react-router-dom';
import Layout from './components/Layout/Layout';

const App = () => (
  <div className="App">
    <Layout>
      <Route path='/' component={Home} />
      <Switch>
        <Route path='/launch' component={LaunchToken} />
        <Route path='/tokens/:tokenAddress' exact component={TokenDetails} />
      </Switch>
    </Layout>
  </div>
)
// WITHOUT CONTEXT
//   if (this.state.loading) return "Loading Drizzle...";
//   return <div className="App">
//     <LaunchToken
//       drizzle={this.props.drizzle}
//       drizzleState={this.state.drizzleState}
//     />
//     <hr/>
//     <ListToken
//       drizzle={this.props.drizzle}
//       drizzleState={this.state.drizzleState}
//     />

//   </div>;
// }

export default App;
