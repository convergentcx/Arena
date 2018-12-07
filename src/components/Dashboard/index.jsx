import React, { Component } from 'react';
// import { Route } from 'react-router-dom';
import Web3 from 'web3';

import PersonalEconomyFactory from '../../build/contracts/PersonalEconomyFactory.json';
import withContext from '../../hoc/withContext';

// import Interface from './DashboardInterface';

import TopTabs from './TopTabs';

class Dashboard extends Component {
  state = {
    tokens: null,
    // web3Contract: null,
    // tokenContract: null,
    // eventsArray: [],
    // tokenPurchaseAmount: null,
    // price: null,
    // reward: null,
    // owner: '',
    // symbol: '',
    // name: '',
    // exponent: null,
    // inverseSlope: null,
    // dataKeyTotalSupply: null,
    // dataKeyPoolBalance: null,
    // dataKeyTokenBalance: null,
    // dataKeyRequestPrice1: null,
    // currentPrice: null,
    // marketCap: null,
    // actions: {
    //   action1: '',
    //   action2: '',
    //   action3: ''
    // },
    // prices: {
    //   price1: '',
    //   price2: '',
    //   price3: ''
    // },
    // popoverOpen: false
  };

  componentDidMount = async () => {
    const { drizzle, drizzleState } = this.props;
    const factoryAddress = drizzle.contracts.PersonalEconomyFactory.address;
    // TODO - Change this to use the metamask provider OR Infura directly if we need to
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    // TODO ^^^
    const factoryContract = new web3.eth.Contract(PersonalEconomyFactory['abi'], factoryAddress);

    const filter = { owner_address: drizzleState.accounts[0] };
    const tokens = [];
    factoryContract.getPastEvents(
      'Created',
      { fromBlock: 0, toBlock: 'latest', filter },
      (_, events) => {
        events.forEach(token => {
          const address = token.returnValues.token_address;
          const date = token.returnValues.time;
          const name = token.returnValues.name;
          tokens.push({ address, date, name });
          this.setState({ tokens });
        });
      }
    );
  };

  render() {
    return (
      <div>
        <TopTabs tokens={this.state.tokens} />
      </div>
    );
  }
}

export default withContext(Dashboard);
