import React, { Component } from 'react';
import classes from './MyToken.module.css';
import withContext from '../../../hoc/withContext';
import { withRouter } from 'react-router-dom';

import Events from './Events/Events';
import PersonalEconomy from '../../../build/contracts/PersonalEconomy.json';
// import ContractInfo from '../../ListToken/TokenDetails/ContractInfo/ContractInfo';
// import BuySell from '../ListToken/TokenDetails/BuySell/BuySell';
// import RequestService from '../ListToken/TokenDetails/RequestService/RequestService';
// import CurveChart from '../ListToken/TokenDetails/Chart/Chart';

// import classes from '../ListToken/TokenDetails/TokenDetails.module.css';

import Services from './Services';
import ProfileCard from './ProfileCard/index.jsx' // somehow default importing of the jsx file from the parent folder does not work here
import MainStats from './Stats/MainStats/index.jsx'; // somehow default importing of the jsx file from the parent folder does not work here
import SmallStats from './Stats/SmallStats/index.jsx'; // somehow default importing of the jsx file from the parent folder does not work here

import CurveChart from './CurveChart/CurveChart'
import BlockHistory from './BlockHistory/BlockHistory'


import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Money from '@material-ui/icons/AttachMoney';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
  card: {
    minWidth: 200,
    position: 'relative'
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
  editButton: {
    position: 'absolute',
    right: '2%',
    top: '3%'
  }
});


const multiplier = 10 ** 18;


class MyTokens extends Component {

  state = {
    dataKeys: {
      totalSupplyKey: '',
      yourBalanceKey: ''
    },
    exponent: 0,
    inverseSlope: 0,
    mhash: '',
    name: '',
    owner: '',
    poolBalance: '',
    symbol: '',
    popover: false,
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

    // TODO IPFS
    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();

    this.setState({
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
    this.props.history.push('/tokens/' + this.props.address);
  };


  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    const address = this.props.match.params.tokenAddress;

    const contract = this.props.drizzleState.contracts[address];

    if (
      !contract ||
      !(this.state.dataKeys.yourBalanceKey in contract.balanceOf) ||
      !(this.state.dataKeys.totalSupplyKey in contract.totalSupply)
    ) {
      return <div>Still Loading...</div>;
    }

    const totalSupply = contract.totalSupply[this.state.dataKeys.totalSupplyKey].value;
    const yourBalance = contract.balanceOf[this.state.dataKeys.yourBalanceKey].value;

    const currentPrice =
      (1 / this.state.inverseSlope) * (totalSupply / multiplier) ** this.state.exponent;



    return (
      <div id={address} className={classes.root}>
        <h3>{this.props.name}</h3>

        <Grid container spacing={24}>
          <ProfileCard />
          <SmallStats 
            currentPrice={currentPrice} 
            totalSupply={totalSupply} 
            poolBalance={this.state.poolBalance}
            symbol={this.state.symbol}
            exponent={this.state.exponent}
            inverseSlope={this.state.inverrseSlope}/>
          <MainStats 
            currentPrice={currentPrice} 
            totalSupply={totalSupply} 
            yourBalance={yourBalance}
            symbol={this.state.symbol}
            />
        </Grid>



        <Grid container spacing={24}>



          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  7 day price chart
                </Typography>
                <CurveChart
                  curveData={{
                    totalSupply: 0,
                    poolBalance: 0,
                    inverseSlope: 0,
                    exponent: 0,
                    currentPrice: 0
                  }}
                  margin={{
                    top: 30,
                    right: 10,
                    bottom: 30,
                    left: 10
                  }}
                  width={300}
                  height={300}
                />
                {/* 
            Here I want to include a price chart, but I am not sure which props it needs and how to set up the contract so that 
            the BlockHistory component can read the events out of it. The BlockHistory and PriceChart components are taken from Memelordz,
            so we can look how it works there exactly.
            <BlockHistory symbol={this.state.symbol} contract={this.props.drizzle.contracts[this.props.address]} showChart /> */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Bonding curve
                </Typography>
                <CurveChart
                  curveData={{
                    totalSupply: totalSupply / multiplier,
                    poolBalance: this.state.poolBalance / multiplier,
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
                  width={300}
                  height={300}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={12} md={4}>
            <Services />
          </Grid>

          <Grid item xs={12} md={8}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Requests and Transactions
                </Typography>
                <Events date={this.props.date} address={address} />
              </CardContent>
            </Card>
          </Grid>

        </Grid>


        <hr />
      </div>
    );
  }
}

export default withStyles(styles)(withContext(withRouter(MyTokens)));