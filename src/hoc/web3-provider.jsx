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

  /**
   * Start polling accounts and network. We poll indefinitely so that we can
   * react to the user changing accounts or networks.
   */
  componentDidMount() {
    this.fetchAccounts();
    this.fetchNetwork();
    this.initAccountsPoll();
    this.initNetworkPoll();
    // if (origin.contractService.walletLinker)
    // {
    //     origin.contractService.walletLinker.showPopUp = this.showLinkerPopUp.bind(this)
    //     if (!origin.contractService.walletLinker.setLinkCode) {
    //       origin.contractService.walletLinker.setLinkCode = this.setLinkerCode.bind(this)
    //     }
    //     origin.contractService.walletLinker.showNextPage = this.showNextPage.bind(this)
    // }
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

  /**
   * Update state regarding the availability of web3 and an ETH account.
   * @return {void}
   */
  fetchAccounts() {
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        console.error(err);
      } else {
        this.handleAccounts(accounts);
      }
    });

    if (web3.currentProvider !== this.state.provider) {
      // got a real provider now
      this.setState({ provider: web3.currentProvider });
    }
  }

  /**
   * Get the network and update state accordingly.
   * @return {void}
   */
  fetchNetwork() {
    const providerExists = web3.currentProvider;
    const previousNetworkId = this.props.networkId;
    const networkConnected =
      web3.currentProvider.connected ||
      (typeof web3.currentProvider.isConnected === 'function' &&
        web3.currentProvider.isConnected());

    if (networkConnected !== this.state.networkConnected) {
      if (this.state.networkConnected !== null) {
        // switch from one second to one minute after change
        clearInterval(this.networkInterval);

        this.networkInterval = setInterval(this.fetchNetwork, ONE_MINUTE);
      }

      if (
        web3.currentProvider.connected !== undefined &&
        web3.currentProvider.isConnected !== undefined
      ) {
        this.setState({ networkConnected });
      }
    }

    providerExists &&
      web3.version &&
      web3.eth.net.getId((err, netId) => {
        const networkId = parseInt(netId, 10);

        if (err) {
          this.setState({
            networkError: err,
          });
        } else if (networkId !== previousNetworkId) {
          this.props.storeNetwork(networkId);
          this.setState({
            networkError: null,
          });
        }

        if (!this.state.networkConnected) {
          this.setState({
            networkConnected: true,
          });
        }
      });
  }

  handleAccounts(accounts) {
    const { messagingInitialized, storeAccountAddress, wallet } = this.props;
    const current = accounts[0];
    const previous = wallet.address ? formattedAddress(wallet.address) : null;
    const walletLinkerEnabled = origin.contractService.walletLinker;

    // on account detection
    if (formattedAddress(current) !== previous) {
      // TODO: fix this with some route magic!
      if (
        !walletLinkerEnabled ||
        previous ||
        ['/my-listings', '/my-purchases', '/my-sales'].includes(this.props.location.pathname) ||
        !current
      ) {
        // reload if changed from a prior account
        previous !== null && window.location.reload();
      } else {
        // load data on account change
        this.props.fetchProfile();
        this.props.getEthBalance();
      }

      // set user_id to wallet address in Google Analytics
      // const gtag = window.gtag || function(){}

      // gtag('set', { 'user_id': current })

      // update global state
      // storeAccountAddress(current)
    }
  }
}

export default Web3Provider;
