import React, { Component } from 'react';

import withContext from '../../hoc/withContext';
import { withRouter } from 'react-router-dom';

import BubbleChart from '@weknow/react-bubble-chart-d3';

import PersonalEconomy from '../../build/contracts/PersonalEconomy.json';

import { getMultihashFromBytes32, getPrice, removeDecimals } from '../../util';

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
    console.log(this.props)

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

  bubbleClick = (label) => {
    this.props.history.push(`/tokens/${label}`)
  }

  legendClick = (label) => {
    console.log("Customer legend click func")
  }

  render() {
    console.log(this.state.personalEconomies)
    let data = [];
    this.state.personalEconomies.forEach((economy)=>{
      data.push(
        { label: economy.address,
          value: removeDecimals(removeDecimals(economy.marketCap.toString()))}
      )
    })

    // let tableRows = [];
    // (() => {
    //   let i = 0;
    //   while (i < this.state.personalEconomies.length) {
    //     const personalEconomy = this.state.personalEconomies[i];

    //     tableRows.push(
    //       <Item
    //         address={personalEconomy.address}
    //         name={personalEconomy.name}
    //         marketCap={personalEconomy.marketCap}
    //         twentyFour="+12%"
    //         sevenDay="+1,003%"
    //       />
    //     );
    //     i++;
    //   }
    // })();

    return (
      <div>
        <BubbleChart
          graph={{
            zoom: 1.1,
            offsetX: -0.05,
            offsetY: -0.01
          }}
          width={1000}
          height={800}
          showLegend={true} // optional value, pass false to disable the legend.
          legendPercentage={20} // number that represent the % of with that legend going to use.
          legendFont={{
            family: 'Arial',
            size: 12,
            color: '#000',
            weight: 'bold',
          }}
          valueFont={{
            family: 'Arial',
            size: 12,
            color: '#fff',
            weight: 'bold',
          }}
          labelFont={{
            family: 'Arial',
            size: 16,
            color: '#fff',
            weight: 'bold',
          }}
          //Custom bubble/legend click functions such as searching using the label, redirecting to other page
          bubbleClickFun={this.bubbleClick}
          legendClickFun={this.legendClick}
          data={data}
        />
      </div>
    );
  }
}

const LeaderboardListContextualized = withRouter(withContext(LeaderboardList));

const Leaderboard = () => (
  <div>
    <LeaderboardListContextualized />
  </div>
);

export default Leaderboard;
