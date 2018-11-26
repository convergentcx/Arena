import Web3 from 'web3';
import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardBody,
  CardText,
  Button,
  Container,
  Row,
  Col,
  Popover,
  PopoverHeader,
  PopoverBody,
  FormGroup,
  Label,
  Table
} from 'reactstrap';
import PersonalEconomyFactory from '../../build/contracts/PersonalEconomyFactory.json';
import Sidebar from './Sidebar/Sidebar';
import MyToken from './MyToken/MyToken';
import Events from './MyToken/Events/Events';
import classes from './Dashboard.module.css';
import { Route, Switch } from 'react-router-dom';
import withContext from '../../hoc/withContext';

{
  /* <Events address={this.props.address}/> */
}

const multiplier = 10 ** 18;

class Dashboard extends Component {
  state = {
    tokens: null,
    web3Contract: null,
    tokenContract: null,
    eventsArray: [],
    tokenPurchaseAmount: null,
    price: null,
    reward: null,
    owner: '',
    symbol: '',
    name: '',
    exponent: null,
    inverseSlope: null,
    dataKeyTotalSupply: null,
    dataKeyPoolBalance: null,
    dataKeyTokenBalance: null,
    dataKeyRequestPrice1: null,
    currentPrice: null,
    marketCap: null,
    actions: {
      action1: '',
      action2: '',
      action3: ''
    },
    prices: {
      price1: '',
      price2: '',
      price3: ''
    },
    popoverOpen: false
  };

  componentDidMount = async () => {
    const { drizzle, drizzleState } = this.props;
    const factoryAddress = drizzle.contracts.PersonalEconomyFactory.address;
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    const factoryContract = new web3.eth.Contract(PersonalEconomyFactory['abi'], factoryAddress);

    // WEB3 WAY OF GETTING CURRENTLY ACTIVE ACCOUNTS AND TOKEN ADDRESSES

    // web3.eth.getAccounts().then(e => { // which addresses does this really return??
    //     let tokens = e.map((address) => {
    //         let filter =  {'owner_address': address};
    //         factoryContract.getPastEvents("Created", { fromBlock: 0, toBlock: "latest", filter}, (err, events) => { console.log(events)});
    //      })
    //     console.log(tokens)

    // })

    let filter = { owner_address: drizzleState.accounts[0] };
    let tokens = [];
    factoryContract.getPastEvents(
      'Created',
      { fromBlock: 0, toBlock: 'latest', filter },
      (err, events) => {
        events.forEach(token => {
          let address = token.returnValues.token_address;
          let date = token.returnValues.time;
          let name = token.returnValues.name;
          tokens.push({ address, date, name });
          this.setState({ tokens });
        });
      }
    );
  };

  render() {
    const tokens =
      this.state.tokens &&
      this.state.tokens.map(token => {
        return (
          <MyToken
            address={token.address}
            date={token.date}
            name={token.name}
            key={token.address}
          />
        );
      });

    return (
      <div className={classes.dashboardContainer}>
        <Sidebar tokens={this.state.tokens} className={classes.menuBox} />
        <Container>{tokens}</Container>
        <Switch>
          {/* <Route path='/dashboard' component={} /> */}
          <Route path="/dashboard/:tokenAddress" exact component={Events} />
        </Switch>
      </div>
    );
  }
}

export default withContext(Dashboard);
