import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Tab, Tabs } from '@material-ui/core';

export default class TopTabs extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const tabs =
      this.props.tokens &&
      this.props.tokens.map(token => {
        return (
          <Link to={`/dashboard/${token.address}`}>
            <Tab label={token.name} />
          </Link>
        );
      });

    return (
      <Tabs
        value={this.state.value}
        onChange={this.handleChange}
        style={{ paddingTop: '60px', paddingLeft: '16px' }}
      >
        {tabs}
      </Tabs>
    );
  }
}
