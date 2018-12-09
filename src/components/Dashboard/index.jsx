import React, { Component } from 'react';
import Web3 from 'web3';

import PersonalEconomyFactory from '../../build/contracts/PersonalEconomyFactory.json';
import withContext from '../../hoc/withContext';

import { makeCancelable } from '../../util';

import TopTabs from './TopTabs';

class Dashboard extends Component {
  state = {
    tokens: null
  };

  componentDidMount = () => {
    const { drizzle, drizzleState } = this.props;
    const factoryAddress = drizzle.contracts.PersonalEconomyFactory.address;
    const web3 = new Web3(drizzle.web3.currentProvider);
    const factoryContract = new web3.eth.Contract(PersonalEconomyFactory['abi'], factoryAddress);

    const filter = { owner_address: drizzleState.accounts[0] };
    const tokens = [];
    this._asyncRequest = makeCancelable(
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
      )
    );
  };

  componentWillUnmount = () => {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
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
