import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Tab, Tabs } from '@material-ui/core';

class TopTabs extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const tabs =
      this.props.tokens &&
      this.props.tokens.map((token, index) => {
        return (
          <Tab label={token.name} key={index} onClick={() => this.props.history.push(`/dashboard/${token.address}`)} />
        );
      });

    return (
      <Tabs
        value={this.state.value}
        onChange={this.handleChange}
        style={{ paddingTop: '60px', paddingLeft: '16px' }}
        fullWidth
        indicatorColor="secondary"
        textColor="secondary"
      >
        {tabs}
      </Tabs>
    );
  }
}

export default withRouter(TopTabs);