import React, { Component } from 'react';
import withContext from '../../../hoc/withContext';
import { withRouter } from 'react-router-dom';

import Events from './Events/Events';
import PersonalEconomy from '../../../build/contracts/PersonalEconomy.json';

import EditColumn from './EditColumn';

import MainStats from './Stats/MainStats/index.jsx';
import SmallStats from './Stats/SmallStats/index.jsx';

import ProfileChart from '../../Profile/ProfileChart.jsx';

import { withStyles } from '@material-ui/core/styles';

import { Grid, Paper, Switch, Tab, Tabs, Typography } from '@material-ui/core';

import { getMultihashFromBytes32, getPrice, toBN } from '../../../util';

import ipfsApi from 'ipfs-api';
const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary
  },
  card: {
    minWidth: 200,
    position: 'relative'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  dense: {
    marginTop: 19
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60
  },
  chip: {
    margin: theme.spacing.unit / 2
  },
  editButton: {
    position: 'absolute',
    right: '2%',
    top: '3%'
  }
});

class Interface extends Component {
  state = {
    dataKeys: {
      totalSupplyKey: '',
      yourBalanceKey: ''
    },
    editing: false,
    exponent: 0,
    inverseSlope: 0,
    loading: false,
    mhash: '',
    name: '',
    owner: '',
    poolBalance: '',
    symbol: '',
    popover: false,
    value: 0,
  };

  async componentDidMount() {
    const { drizzle } = this.props;
    const address = this.props.match.params.tokenAddress;
    const contractConfig = {
      contractName: address,
      web3Contract: new drizzle.web3.eth.Contract(PersonalEconomy['abi'], address)
    };
    let drizzleEvents = ['Minted', 'Burned', 'Requested'];
    await drizzle.addContract(contractConfig, drizzleEvents);

    const contract = this.props.drizzle.contracts[address];

    const totalSupplyKey = contract.methods.totalSupply.cacheCall();
    const yourBalanceKey = contract.methods.balanceOf.cacheCall(
      this.props.drizzleState.accounts[0]
    );

    const exponent = await contract.methods.exponent().call();
    const inverseSlope = await contract.methods.inverseSlope().call();
    const mhash = await contract.methods.mhash().call();
    const owner = await contract.methods.owner().call();
    const poolBalance = await contract.methods.poolBalance().call();

    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();

    const multihash = getMultihashFromBytes32({
      digest: mhash,
      hashFunction: 18,
      size: 32
    });

    const dataJson = JSON.parse((await ipfs.get(multihash))[0].content.toString());

    this.setState({
      contract,
      dataJson,
      dataKeys: {
        totalSupplyKey,
        yourBalanceKey
      },
      exponent,
      inverseSlope,
      mhash,
      name,
      owner,
      poolBalance,
      symbol
    });
  }

  showDetails = () => {
    this.props.history.push('/economies/' + this.props.address);
  };

  handleTabChange = (_, value) => {
    this.setState({ value });
  };

  updateData = newData => {
    this.setState({ dataJson: newData });
  }

  render() {
    const { classes } = this.props;
    const address = this.props.match.params.tokenAddress;
    const contract = this.props.drizzleState.contracts[address];

    if (
      !contract ||
      !(this.state.dataKeys.yourBalanceKey in contract.balanceOf) ||
      !(this.state.dataKeys.totalSupplyKey in contract.totalSupply) ||
      !this.state.dataJson.services
    ) {
      return <div>Still Loading...</div>;
    }

    const totalSupply = contract.totalSupply[this.state.dataKeys.totalSupplyKey].value;
    const yourBalance = contract.balanceOf[this.state.dataKeys.yourBalanceKey].value;

    const currentPrice = getPrice(
      this.state.inverseSlope,
      toBN(totalSupply).toString(),
      this.state.exponent
    );
    return (
      <Grid container spacing={16} style={{ padding: '16px', paddingTop: '2%' }}>
        <Grid item xs={12} md={4}>
          <EditColumn
            address={address}
            contract={contract}
            myContract={this.state.contract}
            dataJson={this.state.dataJson}
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            mhash={this.state.mhash}
            symbol={this.state.symbol}
            updateData={this.updateData}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Tabs
            value={this.state.value}
            indicatorColor="secondary"
            textColor="primary"
            onChange={this.handleTabChange}
            style={{ marginBottom: '16px' }}
          >
            <Tab label="Inbox" />
            <Tab label="Stats" />
            <Tab label="Settings" />
          </Tabs>
          {this.state.value === 0 &&
            <Paper style={{ padding: '3%' }}>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Requests and Transactions
              </Typography>
              <Events date={this.props.date} address={address} drizzle={this.props.drizzle} />
            </Paper>
          }
          {this.state.value === 1 &&
            <Grid container spacing={16}>
              <Typography className={classes.title} color="textSecondary" style={{ marginLeft: '16px' }} gutterBottom>
                Bonding curve
              </Typography>
              <div style={{ width: '100%', height: '400px' }}>
                <ProfileChart
                  curveData={{
                    totalSupply: totalSupply,
                    poolBalance: this.state.poolBalance,
                    inverseSlope: this.state.inverseSlope,
                    exponent: this.state.exponent,
                    currentPrice: currentPrice
                  }}
                  margin={{
                    top: 30,
                    right: 10,
                    bottom: 30,
                    left: 10
                  }}
                  width="100%"
                  height="100%"
                />
              </div>
              <SmallStats
                currentPrice={currentPrice}
                totalSupply={totalSupply}
                poolBalance={this.state.poolBalance}
                symbol={this.state.symbol}
                exponent={this.state.exponent}
                inverseSlope={this.state.inverseSlope}
              />
              <MainStats
                currentPrice={currentPrice}
                totalSupply={totalSupply}
                yourBalance={yourBalance}
                symbol={this.state.symbol}
              />
            </Grid>
          }
          {this.state.value === 2 &&
            <Grid container spacing={16}>
              <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Lights
              </Typography>
              <Switch
                checked={this.props.lights}
                onChange={this.props.toggleLights}
                value="checkedB"
                color="primary"
              />
              </Grid>
            </Grid>  
          }
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(withContext(withRouter(Interface)));
