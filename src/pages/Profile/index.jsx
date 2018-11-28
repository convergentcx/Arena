import React, { Component } from 'react';
import { Area, CartesianGrid, ComposedChart, ReferenceDot, Tooltip, XAxis, YAxis } from 'recharts';
import ipfsApi from 'ipfs-api';

import {
  Col,
  FormGroup,
  Label,
  Popover,
  PopoverHeader,
  PopoverBody,
  Row,
} from 'reactstrap';

import { Button, Card, IconButton, Grid, Typography } from '@material-ui/core';
import { KeyboardBackspace } from '@material-ui/icons';

import PersonalEconomy from '../../build/contracts/PersonalEconomy.json';

import withContext from '../../hoc/withContext';

import BuyAndSellButtons from '../../components/Profile/BuyAndSellButtons.jsx';
import Details from '../../components/Profile/Details.jsx';
import Services from '../../components/Profile/Services.jsx';

const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

const multiplier = 10 ** 18;

class CurveChart extends Component {
  getChartData() {
    let { totalSupply, poolBalance, inverseSlope, exponent, currentPrice } = this.props.curveData;
    poolBalance = parseFloat(poolBalance) || 0;
    totalSupply = parseFloat(totalSupply) || 0;

    let currentPoint = { supply: totalSupply, value: currentPrice };

    let data = [];
    let step = (totalSupply || 50) / 100;

    for (let i = step; i < (totalSupply || 50) * 1.5; i += step) {
      let price = (1 / inverseSlope) * i ** exponent;
      if (i < totalSupply) {
        data.push({
          supply: i,
          sell: price.toFixed(4),
          value: parseFloat(price.toFixed(4))
        });
      } else if (i >= totalSupply) {
        data.push({
          supply: i,
          buy: price.toFixed(4),
          value: parseFloat(price.toFixed(4))
        });
      }
    }
    return { data, currentPoint };
  }

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
            x={currentPoint.supply}
            y={currentPoint.value}
            r={16}
            // fill="blue"
            stroke="#0095b3"
            label={currentPoint.value.toFixed(2)}
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

  toggle = () => {
    this.setState({
      popover: !this.state.popover
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

    const currentPrice =
      (1 / this.state.inverseSlope) * (totalSupply / multiplier) ** this.state.exponent;

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
          <BuyAndSellButtons
            contract={this.props.drizzle.contracts[this.props.addr]}
            drizzleState={this.props.drizzleState}
            symbol={this.state.symbol}
          />
          <Grid container style={{ paddingTop: '2%' }}>

            <Grid item md={6}>
              <Details
                marketCap={currentPrice * (totalSupply / multiplier)}
                name={this.state.name}
                symbol={this.state.symbol}
                tokenBalance={yourBalance / multiplier}
              />
            </Grid>

            <Grid item md={6}>
              <Card>
                <div style={{ padding: '15px', }}>
                  Bonding Curve
                  <div>
                    <Button color="secondary" size="sm" id="Popover1" onClick={this.toggle}>
                      Details
                    </Button>
                  </div>
                  <Popover
                    placement="bottom"
                    isOpen={this.state.popover}
                    target="Popover1"
                    toggle={this.toggle}
                  >
                    <PopoverHeader>Contract Information</PopoverHeader>
                    <PopoverBody>
                      <Row>
                        <Col md={12}>
                          <FormGroup>
                            <Label size="sm" style={labelStyle}>
                              Contract Address
                            </Label>
                            <p> {this.props.addr} </p>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <Label size="sm" style={labelStyle}>
                            Owner Address
                          </Label>
                          <p>{this.state.owner}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <Label size="sm" style={labelStyle}>
                            Price
                          </Label>
                          <p>{currentPrice} ETH</p>
                        </Col>
                        <Col md={4}>
                          <Label size="sm" style={labelStyle}>
                            Reserve Pool
                          </Label>
                          <p>{this.state.poolBalance} ETH </p>
                        </Col>
                        <Col md={4}>
                          <Label size="sm" style={labelStyle}>
                            Total Supply
                          </Label>
                          <p>
                            {totalSupply} {this.state.symbol}
                          </p>
                        </Col>
                      </Row>
                    </PopoverBody>
                  </Popover>
                </div>

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
              </Card>
            </Grid>
          </Grid>

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
