import React from 'react';

const ONE_SECOND = 1000;

class Web3Provider extends React.Component {
  state = {
    accountsInterval: null,
    networkConnected: null,
    networkError: null,
    networkInterval: null,
    provider: null,
  };

  async componentWillMount() {
    this.setState({ provider: web3.currentProvider });
  }

  componentDidMount() {
    this.fetchAccounts();
    this.fetchNetwork();
    this.initAccountsPoll();
    this.initNetworkPoll();
  }

  initAccountsPoll() {
    if (!this.accountsInterval) {
      this.accountsInterval = setInterval(this.fetchAccounts, ONE_SECOND);
    }
  }

  initNetworkPoll() {
    if (!this.networkInterval) {
      this.networkInterval = setInterval(this.fetchNetwork, ONE_SECOND);
    }
  }

  fetchAccounts() {
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        // console.error(err);
      } else {
        this.handleAccounts(accounts);
      }
    });

    if (web3.currentProvider !== this.state.provider) {
      this.setState({ provider: web3.currentProvider });
    }
  }
}

export default Web3Provider;
