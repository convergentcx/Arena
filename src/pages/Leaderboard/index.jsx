import React, { Component } from 'react';

import withContext from '../../hoc/withContext';

import PersonalEconomy from '../../build/contracts/PersonalEconomy.json';

import { getMultihashFromBytes32, getPrice } from '../../util';

import { utils as w3utils } from 'web3';

import Item from './Item';

import ipfsApi from 'ipfs-api';

const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

class LeaderboardList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      personalEconomies: [],
      sub: null
    };
  }

  componentDidMount() {
    const {
      contracts: { PersonalEconomyFactory },
      web3
    } = this.props.drizzle;

    const sub = PersonalEconomyFactory.events
      .Created({
        fromBlock: 0
      })
      .on('data', async event => {
        const { id } = event;
        if (!this.state.events.find(event => event.id === id)) {
          // console.log('not found ' + id)
          const personalEconomy = new web3.eth.Contract(
            PersonalEconomy.abi,
            event.returnValues.token_address
          );
          // const name = await personalEconomy.methods.name().call();
          const mhash = await personalEconomy.methods.mhash().call();
          const contentAddress = getMultihashFromBytes32({
            digest: mhash,
            hashFunction: 18,
            size: 32
          });
          const raw = await ipfs.get(contentAddress);
          const dataJson = JSON.parse(raw[0].content.toString());
          const inverseSlope = await personalEconomy.methods.inverseSlope().call();
          const exponent = await personalEconomy.methods.exponent().call();
          const totalSupply = await personalEconomy.methods.totalSupply().call();
          const currentPrice = getPrice(inverseSlope, totalSupply, exponent);
          // console.log(currentPrice.mul(w3utils.toBN(totalSupply)))
          const newEconomy = {
            address: event.returnValues.token_address,
            currentPrice,
            name: dataJson.name,
            marketCap: currentPrice.mul(w3utils.toBN(totalSupply)),
            services: dataJson.services,
            totalSupply
          };
          const list = [...this.state.personalEconomies, newEconomy];
          this.setState({
            personalEconomies: list
          });
        } else {
          // console.log('aleady has ' + id);
        }
      });

    this.setState({
      sub
    });
  }

  componentWillUnmount() {
    this.state.sub.unsubscribe();
  }

  render() {
    let tableRows = [];
    (() => {
      let i = 0;
      while (i < this.state.personalEconomies.length) {
        const personalEconomy = this.state.personalEconomies[i];

        tableRows.push(
          <Item address={personalEconomy.address} name={personalEconomy.name} marketCap={personalEconomy.marketCap} twentyFour="+12%" sevenDay="+1,003%" />
        );
        i++;
      }
    })();

    return <div>{tableRows}</div>;
  }
}

const LeaderboardListContextualized = withContext(LeaderboardList);

const Leaderboard = () => (
  <div style={{ marginLeft: '200px', marginRight: '200px',padding: '10%' }}>
    <LeaderboardListContextualized />
  </div>
);

export default Leaderboard;
