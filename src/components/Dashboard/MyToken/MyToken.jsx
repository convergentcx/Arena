import React, { Component } from 'react';
import { Card, CardHeader, Button, CardBody, Row, Col } from 'reactstrap';
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


import CurveChart from './CurveChart/CurveChart'
import BlockHistory from './BlockHistory/BlockHistory'


import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Money from '@material-ui/icons/AttachMoney';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
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
    popover: false
  };


  async componentDidMount() {
    const { address, drizzle } = this.props;
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


  getContractData = () => {

  }


  render() {
    const { classes } = this.props;

    const contract = this.props.drizzleState.contracts[this.props.address];

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
      <div id={this.props.address} className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <Paper className={classes.paper} style={{ fontWeight: 'bold', textAlign: 'left' }}>{this.props.name}
              <div className={classes.DetailsButton}>
                <Button color="secondary" size="sm" onClick={this.showDetails} style={{ float: 'right' }}>
                  Details
            </Button>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper} style={{ fontWeight: 'bold', textAlign: 'left' }}>
              <p> Market Cap </p>
              <Money />
              <h4>{currentPrice * (totalSupply / multiplier)}</h4>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper} style={{ fontWeight: 'bold', textAlign: 'left' }}>
              <p>You hold</p>
              <Money />
              <h4>{yourBalance / multiplier.toFixed(3)}</h4>

            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>
              <p>Current Price</p>
              <Money />
              <h4>{currentPrice}</h4>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>
              <p>Current token supply</p>
              <Money />
              <h4>{totalSupply / multiplier}</h4>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>
              <p>Reserve pool</p>
              <Money />
              <h4>{this.state.poolBalance / multiplier}</h4>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>
            <p>Bonding curve formula</p>
              <Money />
              <h4>{`p = 1 / ${this.state.inverseSlope} * x ^ ${this.state.exponent}`} </h4>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
                <CurveChart
                  curveData={{
                    totalSupply: totalSupply/multiplier,
                    poolBalance: this.state.poolBalance/multiplier,
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
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
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
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Events date={this.props.date} address={this.props.address} />
          </Grid>


        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(withContext(withRouter(MyTokens)));









// class ProfileDetails extends Component {
//   constructor(props) {
//     super(props);
//   }

//   async componentDidMount() {
//     const { addr, drizzle } = this.props;
//     const contractConfig = {
//       contractName: addr,
//       web3Contract: new drizzle.web3.eth.Contract(PersonalEconomy.abi, addr)
//     };
//     const events = ['Minted', 'Burned'];
//     await drizzle.addContract(contractConfig, events);

//   }

//   toggle = () => {
//     this.setState({
//       popover: !this.state.popover
//     });
//   };

//   render() {

//     return (
//       <div style={{ padding: '5%' }}>

//         <Grid container style={{ alignItems: 'center' }}>
//           <IconButton onClick={() => this.props.history.goBack()}>
//             <KeyboardBackspace />
//           </IconButton>
//           <div style={{ flexGrow: 1 }} />
//           <Typography variant="title">
//             Personal Economy of {this.props.addr}
//           </Typography>
//         </Grid>


//         <Grid container style={{ paddingTop: '2%' }}>
//           <BuySell
//             contract={this.props.drizzle.contracts[this.props.addr]}
//             drizzleState={this.props.drizzleState}
//             symbol={this.state.symbol}
//           />
//           <Grid container style={{ paddingTop: '2%' }}>

//             <Grid item md={6}>
//               <ContractInfo
//                 marketCap={currentPrice * (totalSupply / multiplier)}
//                 name={this.state.name}
//                 symbol={this.state.symbol}
//                 tokenBalance={yourBalance / multiplier}
//               />
//             </Grid>

//             <Grid item md={6}>
//               <Card>
//                 <div style={{ padding: '15px', }}>
//                   Bonding Curve
//                   <div>
//                     <Button color="secondary" size="sm" id="Popover1" onClick={this.toggle}>
//                       Details
//                     </Button>
//                   </div>
//                   <Popover
//                     placement="bottom"
//                     isOpen={this.state.popover}
//                     target="Popover1"
//                     toggle={this.toggle}
//                   >
//                     <PopoverHeader>Contract Information</PopoverHeader>
//                     <PopoverBody>
//                       <Row>
//                         <Col md={12}>
//                           <FormGroup>
//                             <Label size="sm" style={labelStyle}>
//                               Contract Address
//                             </Label>
//                             <p> {this.props.addr} </p>
//                           </FormGroup>
//                         </Col>
//                       </Row>
//                       <Row>
//                         <Col md={12}>
//                           <Label size="sm" style={labelStyle}>
//                             Owner Address
//                           </Label>
//                           <p>{this.state.owner}</p>
//                         </Col>
//                       </Row>
//                       <Row>
//                         <Col md={4}>
//                           <Label size="sm" style={labelStyle}>
//                             Price
//                           </Label>
//                           <p>{currentPrice} ETH</p>
//                         </Col>
//                         <Col md={4}>
//                           <Label size="sm" style={labelStyle}>
//                             Reserve Pool
//                           </Label>
//                           <p>{this.state.poolBalance} ETH </p>
//                         </Col>
//                         <Col md={4}>
//                           <Label size="sm" style={labelStyle}>
//                             Total Supply
//                           </Label>
//                           <p>
//                             {totalSupply} {this.state.symbol}
//                           </p>
//                         </Col>
//                       </Row>
//                     </PopoverBody>
//                   </Popover>
//                 </div>

//                 <CurveChart
//                   curveData={{
//                     totalSupply: totalSupply,
//                     poolBalance: this.state.poolBalance,
//                     inverseSlope: this.state.inverseSlope,
//                     exponent: this.state.exponent,
//                     currentPrice: currentPrice
//                   }}
//                   margin={{
//                     top: 30,
//                     right: 10,
//                     bottom: 30,
//                     left: 10
//                   }}
//                   width={300}
//                   height={300}
//                 />
//               </Card>
//             </Grid>
//           </Grid>

//           <RequestService
//             account={this.props.drizzleState.accounts[0]}
//             contract={this.props.drizzle.contracts[this.props.addr]}
//             mhash={this.state.mhash}
//             symbol={this.state.symbol}
//           />
//         </Grid>
//       </div>
//     );
//   }
// }