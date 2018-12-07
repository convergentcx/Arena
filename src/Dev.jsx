/// Development Testing Page

import React from 'react';

import Interface from './components/Dashboard/DashboardInterface';
class Dev extends React.Component {
  state = {
    value: 2
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    return (
      <div>
        <Interface dataJson={{
          
        }}></Interface>
      </div>
    );
  }
}

export default Dev;
