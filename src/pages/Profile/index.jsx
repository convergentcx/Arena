import React, { Component } from 'react';
import { Area, CartesianGrid, ComposedChart, ReferenceDot, Tooltip, XAxis, YAxis } from 'recharts';
import ipfsApi from 'ipfs-api';

import { Button, Card, CardContent, CardHeader, IconButton, Grid, Popover, Typography } from '@material-ui/core';
import { KeyboardBackspace } from '@material-ui/icons';

import PersonalEconomy from '../../build/contracts/PersonalEconomy.json';

import withContext from '../../hoc/withContext';

import BuyAndSellButtons from '../../components/Profile/BuyAndSellButtons.jsx';
import Details from '../../components/Profile/Details.jsx';
import Services from '../../components/Profile/Services.jsx';

import { CardMedia } from '@material-ui/core';
import Hannah from '../../assets/hannah.jpg';

import {
  addDecimals,
  getPrice,
  removeDecimals
} from '../../util';

import { utils } from 'web3';

const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

const multiplier = 10 ** 18;

class CurveChart extends Component {
  getChartData = () => {
    let { 
      currentPrice,
      exponent,
      inverseSlope,
      poolBalance,
      totalSupply,
    } = this.props.curveData;

    poolBalance = utils.toBN(poolBalance);
    totalSupply = utils.toBN(totalSupply);

    const currentPoint = {
      x: parseFloat(removeDecimals(totalSupply.toString())).toFixed(4),
      y: parseFloat(removeDecimals(currentPrice.toString())).toFixed(4),
    };

    let data = [
      {supply: 0, sell: 0, value: 0}
    ];

    const step = utils.toBN(10**17);
    for (let i = step; i.lte(utils.toBN(750).mul(step)); i = i.add(step)) {
      const price = getPrice(inverseSlope, i, exponent);
      if (i.lte(totalSupply)) {
        data.push({ 
          supply: parseFloat(removeDecimals(i)).toFixed(4), 
          sell: parseFloat(removeDecimals(price)).toFixed(4), 
          value: parseFloat(removeDecimals(price)).toFixed(4),
        });
      } else if (i.gt(totalSupply)) {
        data.push({
          supply: parseFloat(removeDecimals(i)).toFixed(4), 
          buy: parseFloat(removeDecimals(price)).toFixed(4), 
          value: parseFloat(removeDecimals(price)).toFixed(4),
        });
      }
    }

    return {
      data, 
      currentPoint,
    };
  }

  // getChartData() {
  //   let { totalSupply, poolBalance, inverseSlope, exponent, currentPrice } = this.props.curveData;
  //   poolBalance = parseFloat(poolBalance) || 0;
  //   totalSupply = parseFloat(totalSupply) || 0;

  //   let currentPoint = { supply: totalSupply, value: currentPrice };

  //   let data = [];
  //   let step = (totalSupply || 50) / 100;

  //   for (let i = step; i < (totalSupply || 50) * 1.5; i += step) {
  //     let price = (1 / inverseSlope) * i ** exponent;
  //     if (i < totalSupply) {
  //       data.push({
  //         supply: i,
  //         sell: price.toFixed(4),
  //         value: parseFloat(price.toFixed(4))
  //       });
  //     } else if (i >= totalSupply) {
  //       data.push({
  //         supply: i,
  //         buy: price.toFixed(4),
  //         value: parseFloat(price.toFixed(4))
  //       });
  //     }
  //   }
  //   return { data, currentPoint };
  // }

  render() {
    let { data, currentPoint } = this.getChartData();

    return (
      <div>
        <ComposedChart
          style={{ margin: 'auto' }}
          width={this.props.width}
          height={this.props.height}
          data={data}
          margin={this.props.margin}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="supply" type={'number'} />
          <YAxis dataKey="value" type={'number'} />
          <Tooltip />

          <Area
            isAnimationActive={false}
            dots={false}
            stackOffset={'none'}
            dataKey="value"
            name={'price'}
            key={'price'}
            stroke="#0095b3"
            fill="none"
          />

          <Area
            isAnimationActive={false}
            stackOffset={'none'}
            dataKey="sell"
            stroke="#0095b3"
            fill="#0095b3"
          />

          <ReferenceDot
            isFront={true}
            ifOverflow="extendDomain"
            x={currentPoint.x}
            y={currentPoint.y}
            r={16}
            // fill="blue"
            stroke="#0095b3"
            label={currentPoint.y}
          />
        </ComposedChart>
      </div>
    );
  }
}

const labelStyle = {
  margin: 0,
  padding: 0,
  fontSize: '10px'
};

class ProfileDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
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
    };
  }

  async componentDidMount() {
    const { addr, drizzle } = this.props;
    const contractConfig = {
      contractName: addr,
      web3Contract: new drizzle.web3.eth.Contract(PersonalEconomy.abi, addr)
    };
    const events = ['Minted', 'Burned'];
    await drizzle.addContract(contractConfig, events);
    const contract = this.props.drizzle.contracts[this.props.addr];

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

  openPopover = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  render() {
    const contract = this.props.drizzleState.contracts[this.props.addr];

    if (
      !contract ||
      !(this.state.dataKeys.yourBalanceKey in contract.balanceOf) ||
      !(this.state.dataKeys.totalSupplyKey in contract.totalSupply)
    ) {
      return <div>Still Loading...</div>;
    }

    const totalSupply = contract.totalSupply[this.state.dataKeys.totalSupplyKey].value;
    const yourBalance = contract.balanceOf[this.state.dataKeys.yourBalanceKey].value;

    const currentPrice = getPrice(
      this.state.inverseSlope,
      utils.toBN(totalSupply).toString(),
      this.state.exponent
    );

    return (
      <div style={{ padding: '5%' }}>

        <Grid container style={{ alignItems: 'center' }}>
          <IconButton onClick={() => this.props.history.goBack()}>
            <KeyboardBackspace />
          </IconButton>
          <div style={{ flexGrow: 1 }} />
          <Typography variant="title">
            Personal Economy of {this.props.addr}
          </Typography>
        </Grid>


        <Grid container style={{ paddingTop: '2%' }}>
          <Grid container style={{ paddingTop: '2%' }}>
            <Grid item md={6}>
              <Card style={{ margin: '6px' }}>
                <CardMedia
                    alt="person's photo"
                    image={Hannah}
                    style={{ height: '0', paddingTop: '56.25%' }}
                  />
                <CardHeader title="About Hannah" />
                <CardContent>
                  Hi I am Hanna - I like to get paid when someone wants something from me..
                </CardContent>
              </Card>
            </Grid>

            <Grid item md={6}>
              <Card style={{ margin: '6px' }}>
                <Grid container>
                  <Grid item sm={12} style={{ display: 'flex' }}>
                    <div style={{ flexGrow: 1 }} />
                    <div style={{ padding: '15px', }}>
                      <Button
                        color="secondary"
                        size="sm" 
                        aria-owns={Boolean(this.state.anchorEl) ? 'simple-popper' : undefined}
                        aria-haspopup="true"
                        variant="contained"
                        onClick={this.openPopover}
                      >
                        Details
                      </Button>
                    </div>
                  </Grid>

                  <Grid item sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <CurveChart
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
                      width={300}
                      height={300}
                    />
                  </Grid>
                </Grid>
              </Card>
              <div style={{ padding: '2%' }}>
                <BuyAndSellButtons
                  contract={this.props.drizzle.contracts[this.props.addr]}
                  drizzleState={this.props.drizzleState}
                  symbol={this.state.symbol}
                />
              </div>
            </Grid>

            <Grid item md={6}>
              <Details
                marketCap={currentPrice.mul(utils.toBN(totalSupply))}
                name={this.state.name}
                symbol={this.state.symbol}
                tokenBalance={yourBalance / multiplier}
              />
            </Grid>

          </Grid>


          <Popover
            id="simple-popper"
            anchorEl={this.state.anchorEl}
            onClose={() => this.setState({ anchorEl: null })}
            open={Boolean(this.state.anchorEl)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >  
            <Card style={{ width: '440px', padding: '11px', fontSize: '11px' }}>                
              <CardHeader title="Contract Information" style={{ textAlign: 'center' }} />
              <CardContent style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                <Grid container>
                  <Grid item md={12}>
                    Contract Address
                    <p>{this.props.addr}</p>
                  </Grid>
                  <Grid item md={12}>
                    Owner Address
                    <p>{this.state.owner}</p>
                  </Grid>
                  <Grid item md={4}>
                    Price
                    <p>{currentPrice} ETH</p>
                  </Grid>
                  <Grid item md={4}>
                    Reserve Pool
                    <p>{this.state.poolBalance} ETH </p>
                  </Grid>
                  <Grid item md={4}>
                    Total Supply
                    <p>
                      {totalSupply} {this.state.symbol}
                    </p>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Popover>


          <Services
            account={this.props.drizzleState.accounts[0]}
            contract={this.props.drizzle.contracts[this.props.addr]}
            mhash={this.state.mhash}
            symbol={this.state.symbol}
          />
        </Grid>
      </div>
    );
  }
}

const ProfileDetailsContextualized = withContext(ProfileDetails);

const Profile = props => (
  <div style={{ padding: '' }}>
    <ProfileDetailsContextualized addr={props.match.params.tokenAddress} history={props.history} />
  </div>
);

export default Profile;
