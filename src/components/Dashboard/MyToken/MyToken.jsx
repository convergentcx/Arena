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
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import CurveChart from './CurveChart/CurveChart'
import BlockHistory from './BlockHistory/BlockHistory'


import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Money from '@material-ui/icons/AttachMoney';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
  smallCard: {
    width: '95%',
    boxSizing: 'border-box',
    margin: 0,
  },
  mediumCard: {
    height: '95%'
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
  menu: {
    width: 200,
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
    right: 10,
    top: 15
  }
});


const currencies = [
  {
    value: 'attention',
    label: 'Attention',
  },
  {
    value: 'media',
    label: 'Media',
  },
  {
    value: 'arts',
    label: 'Arts',
  },
  {
    value: 'consulting',
    label: 'Consulting',
  },
];


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


    name: 'Cat in the Hat',
    age: '',
    multiline: 'Whoever pays me in token will get my full attention I am very good at listening to peoples problems and helping',
    currency: 'EUR',
    editingProfile: false,
    displayName: 'My Token',
    editingServices: false,
  };


  async componentDidMount() {
    const { drizzle } = this.props;
    const address = this.props.match.params.tokenAddress;
    console.log("biatch")
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


  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  toggleEditable = () => {
    this.setState({editingProfile: !this.state.editingProfile})
  }

  toggleServiceEditable = () => {
    this.setState({editingServices: !this.state.editingServices})
  }

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
          <Grid item md={4} xs={12}>
            <Card className={classes.card} style={{height: '100%'}}>
              <CardHeader
                avatar={
                  <Avatar aria-label="Recipe" className={classes.bigAvatar}>
                    R
            </Avatar>
                }
                title={
                  <TextField
                    id="standard-read-only-input"
                    value={this.state.displayName}
                    onChange={this.handleChange('displayName')}
                    className={classes.textField}
                    margin="normal"
                    InputProps={{
                      readOnly: !this.state.editingProfile,
                    }}
                  />
                }
                // What follows is an idea for how people could give themselves tags. Not sure how/if we 
                // should add these for the alpha

                subheader={
                  <div>
                    <Chip label="blockchain" className={classes.chip} />
                    <Chip label="mentorship" className={classes.chip} />
                  </div>
                }
              />
              <Button color={this.state.editingProfile ? 'primary' : 'secondary'} size="sm" onClick={this.toggleEditable} className={classes.editButton}>
                      {this.state.editingProfile ? 'Save' : 'Edit'}
              </Button>
              <CardContent>
                <form className={classes.container} noValidate autoComplete="off">

                  <TextField
                    id="standard-full-width"
                    value={this.state.multiline}
                    onChange={this.handleChange('multiline')}
                    label="Description"
                    style={{ margin: 8 }}
                    placeholder="My token will give you .."
                    helperText="Tell your investors why you are going to the moon"
                    fullWidth
                    multiline
                    // rows="4"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      readOnly: !this.state.editingProfile,
                    }}
                  />

                </form>

              </CardContent>
            </Card>
          </Grid>





          <Grid item md={5} sm={12} xs={12}>
            <Grid container style={{height: '100%'}}>
              <Grid item sm={12} style={{height: '50%', display: 'flex', 'paddingBottom': '6px'}}>
                <Card className={classes.smallCard} style={{ marginRight: '6px' }} >
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      Current Price
                    </Typography>
                    <Typography variant="h6" component="h2">
                      {currentPrice} Ξ
                    </Typography>
                  </CardContent>
                </Card>

                {/* 2 */}
                <Card className={classes.smallCard} style={{'marginLeft': '6px'}}>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      Current Token Supply
                    </Typography>
                    <Typography variant="h6" component="h2">
                      {totalSupply / multiplier} {this.state.symbol}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item sm={12} style={{height: '50%', display: 'flex', 'paddingTop': '6px' }}>
                <Card className={classes.smallCard} style={{'marginRight': '6px'}}>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      Reserve Pool
                    </Typography>
                    <Typography variant="h6" component="h2">
                      {this.state.poolBalance / multiplier} Ξ
                    </Typography>
                  </CardContent>
                </Card>

                <Card className={classes.smallCard} style={{'marginLeft': '6px'}}>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      Price formula
                    </Typography>
                    <Typography variant="h6" component="h2">
                      {`p = 1 / ${this.state.inverseSlope} * supply ^ ${this.state.exponent}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>

          </Grid>
          <Grid item md={3} xs={12} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            
            
            <Grid item md={12} style={{paddingBottom: '6px'}}>
            <Card>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Your Balance
                </Typography>
                <Typography variant="h2" component="h2">
                  {yourBalance / multiplier.toFixed(3)} {this.state.symbol}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Current Value: {(yourBalance / multiplier.toFixed(3)) * currentPrice * 500} $
                </Typography>

              </CardContent>
            </Card>

            </Grid>

            <Grid item md={12} style={{paddingTop: '6px'}}>

            <Card>

              <CardContent>

                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Market Cap
                </Typography>
                <Typography variant="h2" component="h2">
                  {currentPrice * (totalSupply / multiplier)} Ξ
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Current Value: {currentPrice * (totalSupply / multiplier) * 500} $
                </Typography>

              </CardContent>
            </Card>
            </Grid>

          </Grid>
        </Grid>



        <Grid container spacing={24}>



          <Grid item xs={12} sm={12} md={6}>
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
          <Grid item xs={12} sm={12} md={6}>
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
          <Grid item xs={12} sm={12} md={4}>


            <Card className={classes.card}>
              <CardHeader
                title={"Your services"}
                subheader={"What can people get with your token?"}
              />
              <Button color={this.state.editingServices ? 'primary' : 'secondary'} size="sm" onClick={this.toggleServiceEditable} className={classes.editButton}>
                    {this.state.editingServices ? 'Save' : 'Edit'}
                  </Button>
              <CardContent>
                <form className={classes.container} noValidate autoComplete="off">

                  <Grid container sm={12}>
                    <Grid item sm={6}>
                      <TextField
                        required
                        id="standard-required"
                        label="req"
                        defaultValue="Service 1"
                        value={this.state.service1}
                        onChange={this.handleChange('service1')}
                        className={classes.textField}
                        margin="normal"
                        InputProps={{
                      readOnly: !this.state.editingServices,
                    }}
                      />

                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        id="standard-number"
                        label="Number"
                        value={this.state.age}
                        onChange={this.handleChange('age')}
                        type="number"
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        InputProps={{
                      readOnly: !this.state.editingServices,
                    }}
                      />
                    </Grid>
                  </Grid>

                </form>


              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={12} md={8}>
            <Card className={classes.card}>
              <Typography>

                </Typography>
              <CardContent>


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