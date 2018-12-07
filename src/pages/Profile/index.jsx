import React, { Component } from 'react';
import ipfsApi from 'ipfs-api';
import Web3 from 'web3';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Popover,
  Tab,
  Tabs
} from '@material-ui/core';
// import { KeyboardBackspace } from '@material-ui/icons';

import PersonalEconomy from '../../build/contracts/PersonalEconomy.json';

import withContext from '../../hoc/withContext';

import InfoCard from '../../components/Profile/QuickFacts.jsx';
import ServicePanel from '../../components/Profile/ServicePanel.jsx';
import BuyAndSellButtons from '../../components/Profile/BuyAndSellButtons.jsx';
import Photo from '../../components/Profile/Photo.jsx';
import ProfileChart from '../../components/Profile/ProfileChart.jsx';

import { getMultihashFromBytes32, getPrice, removeDecimals } from '../../util';
import { utils } from 'web3';

const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

class ProfileDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      dataJson: {},
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
      value: 0
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

    const multihash = getMultihashFromBytes32({
      digest: mhash,
      hashFunction: 18,
      size: 32
    });

    const dataJson = JSON.parse((await ipfs.get(multihash))[0].content.toString());

    const { description, image, name, symbol } = dataJson;
    let pic = '';
    if (image.data) {
      pic = Buffer.from(image.data).toString('base64');
    }

    // workaround with additional instance of contract, because drizzle does not support getPastEvents
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    const web3Contract = new web3.eth.Contract(PersonalEconomy['abi'], addr);
    let eventsArray = [];
    await web3Contract.getPastEvents('Minted', { fromBlock: 0, toBlock: 'latest' }, (err, event) => {
      eventsArray.push(event[0].address);
      // this.setState({ eventsArray });
    });
    let unique = [...new Set(eventsArray)];
    let contributors = unique.length;
    
    this.setState({
      dataKeys: {
        totalSupplyKey,
        yourBalanceKey
      },
      dataJson,
      description,
      exponent,
      inverseSlope,
      mhash,
      name,
      owner,
      pic,
      poolBalance,
      symbol,
      contributors
    });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  openPopover = event => {
    this.setState({
      anchorEl: event.currentTarget
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
    // const yourBalance = contract.balanceOf[this.state.dataKeys.yourBalanceKey].value;

    const currentPrice = getPrice(
      this.state.inverseSlope,
      utils.toBN(totalSupply).toString(),
      this.state.exponent
    );

    return (
      <div>
        {/* Header */}
        <Paper
          square
          style={{
            height: '54vh',
            background: this.state.favoriteColor || 'teal',
            paddingLeft: '20%',
            display: 'flex',
            alignItems: 'flex-end'
          }}
        >
          <h1 style={{ color: 'white' }}>Economy of {this.state.name}</h1>
        </Paper>
        <Paper square style={{ background: 'white', height: '14vh' }}>
          <div style={{ position: 'absolute', top: 0, height: '68vh', width: '100%' }}>
            <Grid container style={{ height: '100%' }}>
              <Grid
                item
                xs={12}
                md={3}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  paddingBottom: '5vh',
                  height: '100%',
                  width: '100%'
                }}
              >
                <Photo pic={'data:image/jpeg;base64,' + this.state.pic} width="50%" />
              </Grid>
              <Grid
                item
                xs={0}
                md={6}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  height: '100%',
                  width: '100%'
                }}
              >
                <Tabs
                  value={this.state.value}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={this.handleChange}
                >
                  <Tab label="Summary" />
                  <Tab label="Contribute" />
                  <Tab label="Services" />
                </Tabs>
              </Grid>
              <Grid
                item
                xs={0}
                md={3}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  paddingBottom: '3vh',
                  height: '100%',
                  width: '100%'
                }}
              >
                <Button color="secondary" size="large" variant="contained">
                  CONTRIBUTE
                </Button>
              </Grid>
            </Grid>
          </div>
        </Paper>

        {/* Content */}
        <Grid
          container
          spacing={16}
          style={{ padding: '4%', paddingTop: '16px', minHeight: '80vh' }}
        >
          <Grid item xs={3}>
            <InfoCard
              contributors={this.state.contributors}
              marketCap={removeDecimals(removeDecimals(utils.toBN(totalSupply).mul(currentPrice)))}
              socials={{
                twitter: 'https://convergent.cx',
                facebook: 'https://convergent.cx',
                instagram: 'https://convergent.cx'
              }}
              width="100%"
            />
          </Grid>
          <Grid item xs={6}>
            {this.state.value === 1 && (
              <div>
                <Grid container>
                  <Grid item sm={12} style={{ display: 'flex' }}>
                    <div style={{ flexGrow: 1 }} />
                    <div style={{ padding: '15px' }}>
                      <Button
                        color="secondary"
                        size="small"
                        aria-owns={this.state.anchorEl ? 'simple-popper' : undefined}
                        aria-haspopup="true"
                        variant="contained"
                        onClick={this.openPopover}
                      >
                        Details
                      </Button>
                    </div>
                  </Grid>

                  <Grid item sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '100%', height: '33vh' }}>
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
                  </Grid>
                </Grid>

                <BuyAndSellButtons
                  contract={this.props.drizzle.contracts[this.props.addr]}
                  drizzleState={this.props.drizzleState}
                  symbol={this.state.symbol}
                />
              </div>
            )}
            {this.state.value === 0 && (
              <Paper style={{ textAlign: 'center', minHeight: '50vh', padding: '2%' }}>
                <p>{this.state.description}</p>
              </Paper>
            )}
          </Grid>
          <Grid item xs={3}>
            <ServicePanel symbol={this.state.symbol} dataJson={this.state.dataJson} />
          </Grid>
        </Grid>

        {/* Popover */}
        <Popover
          id="simple-popper"
          anchorEl={this.state.anchorEl}
          onClose={() => this.setState({ anchorEl: null })}
          open={Boolean(this.state.anchorEl)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <Card style={{ width: '440px', padding: '11px', fontSize: '11px' }}>
            <CardHeader title="Contract Details" style={{ textAlign: 'center' }} />
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
                  <p>{removeDecimals(currentPrice)} ETH</p>
                </Grid>
                <Grid item md={4}>
                  Reserve Pool
                  <p>{removeDecimals(this.state.poolBalance)} ETH </p>
                </Grid>
                <Grid item md={4}>
                  Total Supply
                  <p>
                    {removeDecimals(totalSupply)} {this.state.symbol}
                  </p>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Popover>
      </div>
    );
  }
}

const ProfileDetailsContextualized = withContext(ProfileDetails);

const Profile = props => (
  <div>
    <ProfileDetailsContextualized addr={props.match.params.tokenAddress} history={props.history} />
  </div>
);

export default Profile;
