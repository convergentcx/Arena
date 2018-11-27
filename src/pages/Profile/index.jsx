import React, { Component } from 'react';
import { Area, CartesianGrid, ComposedChart, ReferenceDot, Tooltip, XAxis, YAxis } from 'recharts';
import ipfsApi from 'ipfs-api';

import {
  CardImg,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Popover,
  PopoverHeader,
  PopoverBody,
  Row,
  Table
} from 'reactstrap';

import { Button, Card, CardContent, CardHeader, IconButton, Grid, Typography } from '@material-ui/core';
import { KeyboardBackspace } from '@material-ui/icons';

import PersonalEconomy from '../../build/contracts/PersonalEconomy.json';

import withContext from '../../hoc/withContext';

import { getMultihashFromBytes32 } from '../../util';

const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

const multiplier = 10 ** 18;

class BuySell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      priceInEther: 0,
      rewardInEther: 0
    };
  }

  buyHandler = () => {
    const buyStackId = this.props.contract.methods.mint.cacheSend(String(10 ** 18), {
      from: this.props.drizzleState.accounts[0],
      value: String(this.state.priceInEther)
    });
    this.setState({ buyStackId });
  };

  getStatus = txStackId => {
    const { transactions, transactionStack } = this.props.drizzleState;
    const txHash = transactionStack[this.state[txStackId]];
    if (!txHash) return null;
    return `Transaction status: ${transactions[txHash].status}`;
  };

  inputUpdate = async event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });

    // Update price
    if (name === 'buyAmt') {
      const priceInEther = await this.props.contract.methods.priceToMint(String(10 ** 18)).call();
      this.setState({
        priceInEther
      });
    }

    // Update reward
    if (name === 'sellAmt') {
      const rewardInEther = await this.props.contract.methods
        .rewardForBurn(String(10 ** 18))
        .call();
      this.setState({
        rewardInEther
      });
    }
  };

  sellHandler = () => {
    const sellStackId = this.props.contract.methods.burn.cacheSend(String(10 ** 18), {
      from: this.props.drizzleState.accounts[0]
    });
    this.setState({ sellStackId });
  };

  render() {
    return (
      <Grid container>

        <Grid item md={6}>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <Button color="primary" onClick={this.buyHandler}>
                Buy
              </Button>
            </InputGroupAddon>
            <Input
              type="number"
              name="buyAmt"
              onChange={this.inputUpdate}
              placeholder={this.props.symbol}
            />
            <InputGroupAddon addonType="append">
              With {(this.state.priceInEther / multiplier).toFixed(3)} ETH
            </InputGroupAddon>
          </InputGroup>
          <div>{this.getStatus('buyStackId')}</div>
        </Grid>

        <Grid item md={6}>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <Button color="primary" onClick={this.sellHandler}>
                Sell
              </Button>
            </InputGroupAddon>
            <Input
              type="number"
              name="sellAmt"
              onChange={this.inputUpdate}
              placeholder={this.props.symbol}
            />
            <InputGroupAddon addonType="prepend">
              For {(this.state.rewardInEther / multiplier).toFixed(3)} ETH
            </InputGroupAddon>
          </InputGroup>
          <div>{this.getStatus('sellStackId')}</div>
        </Grid>

      </Grid>
    );
  }
}

const ContractInfo = props => (
  <div>
    <Grid container>
      <Grid item md={6}>
        <Card>
          <CardHeader>Market Cap</CardHeader>
          <CardContent>{props.marketCap} ETH</CardContent>
        </Card>
      </Grid>
      <Grid item md={6}>
        <Card>
          <CardHeader>You own</CardHeader>
          <CardContent>
            {props.tokenBalance} {props.symbol}
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    <Grid container style={{ paddingTop: '2%' }}>
      <Grid item md={12}>
        <Card>
          <CardHeader>About {props.name}</CardHeader>
          <CardContent>
            Hi I am Hanna - I like to get paid when someone wants something from me..
          </CardContent>
          <CardImg
            top
            width="100%"
            height="20%"
            src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=100"
            alt="Card image cap"
          />
        </Card>
      </Grid>
    </Grid>
  </div>
);

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

class RequestService extends Component {
  constructor(props) {
    super(props);
    this.state = { jsonData: {}, message: '', stackId: '' };
  }

  async componentDidMount() {
    const contentAddress = getMultihashFromBytes32({
      digest: this.props.mhash,
      hashFunction: 18,
      size: 32
    });

    const result = await ipfs.get('/ipfs/' + contentAddress);
    const contentString = result[0].content.toString();
    const jsonData = JSON.parse(contentString);
    this.setState({
      jsonData
    });
  }

  inputUpdate = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  requestWithEth = serviceIndex => {
    const { contract, account } = this.props;
    const stackId = contract.methods.requestWithEth.cacheSend(
      this.state.message,
      String(this.state.jsonData.services[serviceIndex].price * multiplier),
      {
        from: account
        // value: this.state.jsonData.services[serviceIndex].price * multiplier,
      }
    );
    this.setState({ stackId });
  };

  requestWithToken = serviceIndex => {
    const { contract, account } = this.props;
    const stackId = contract.methods.requestWithToken.cacheSend(this.state.message, {
      from: account
    });
    this.setState({ stackId });
  };

  render() {
    if (!this.state.jsonData.services) {
      return <div>Still Loading...</div>;
    }

    let items = this.state.jsonData.services.map((serviceObj, i) => {
      return (
        <tr key={i}>
          <td>{serviceObj.what}</td>
          <td>{serviceObj.price}</td>
          <td>
            <Input name="message" onChange={this.inputUpdate} />
          </td>
          <td>
            <Button color="danger" onClick={() => this.requestWithEth(i)}>
              Request with ETH
            </Button>
          </td>
          <td>
            <Button color="success" onClick={() => this.requestWithToken(i)}>
              Request with {this.props.symbol}
            </Button>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Price</th>
              <th>Message</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>{items}</tbody>
        </Table>
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
          <BuySell
            contract={this.props.drizzle.contracts[this.props.addr]}
            drizzleState={this.props.drizzleState}
            symbol={this.state.symbol}
          />
          <Grid container style={{ paddingTop: '2%' }}>

            <Grid item md={6}>
              <ContractInfo
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

          <RequestService
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
