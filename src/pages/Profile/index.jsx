import React, { Component } from 'react';
import ipfsApi from 'ipfs-api';
import Web3 from 'web3';
import classes from './Profile.module.css';

import { Button, Collapse, Grid, Paper, Tab, Tabs, Typography } from '@material-ui/core';

import PersonalEconomy from '../../build/contracts/PersonalEconomy.json';

import withContext from '../../hoc/withContext';

import {
  BuyAndSellButtons,
  InfoCard,
  OwnerCard,
  Photo,
  ProfileChart,
  ServiceDetails,
  ServicePanel,
} from '../../components/Profile';

import { getMultihashFromBytes32, getPrice, removeDecimals, toBN } from '../../util';

const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

class ProfileDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      dataJson: {},
      dataKeys: {
        totalSupplyKey: '',
        yourBalanceKey: '',
      },
      exponent: 0,
      inverseSlope: 0,
      mhash: '',
      name: '',
      owner: '',
      poolBalance: '',
      symbol: '',
      value: 0,
      expanded: false,
    };
  }

  async componentDidMount() {
    const { addr, drizzle } = this.props;
    const contractConfig = {
      contractName: addr,
      web3Contract: new drizzle.web3.eth.Contract(PersonalEconomy.abi, addr),
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
      size: 32,
    });

    const dataJson = JSON.parse((await ipfs.get(multihash))[0].content.toString());

    const { description, image, name, symbol } = dataJson;
    let pic = '';
    if (image.data) {
      pic = Buffer.from(image.data).toString('base64');
    }

    const web3 = new Web3(drizzle.web3.currentProvider);
    const web3Contract = new web3.eth.Contract(PersonalEconomy['abi'], addr);
    let eventsArray = [];

    await web3Contract.getPastEvents('Minted', { fromBlock: 0, toBlock: 'latest' }, (_, event) => {
      event[0] && eventsArray.push(event[0].address);
    });

    let unique = [...new Set(eventsArray)];
    let contributors = unique.length;

    this.setState({
      dataKeys: {
        totalSupplyKey,
        yourBalanceKey,
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
      contributors,
    });
  }

  handleChange = (_, value) => {
    this.setState({ value });
  };

  openPopover = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
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
      toBN(totalSupply).toString(),
      this.state.exponent
    );

    return (
      <div style={{ width: '100vw' }}>
        {/* Header */}
        <Grid
          container
          style={{
            height: '33vh',
            background: this.state.favoriteColor || 'rgb(216, 75, 42)',
          }}
        >
          <Grid item xs={false} md={3} className={classes.NameBoxSpacer} />
          <Grid item xs={12} md={9} className={classes.NameBox}>
            <h1 className={classes.Name}>{this.state.name}</h1>
          </Grid>
        </Grid>

        <div
          style={{
            position: 'absolute',
            top: '7vh',
            height: '40vh',
            width: '100%',
          }}
        >
          <Grid container style={{ height: '100%' }}>
            <Grid item xs={12} md={3} className={classes.PhotoBox}>
              <Photo
                pic={'data:image/jpeg;base64,' + this.state.pic}
                width="55%"
                className={classes.Photo}
              />
            </Grid>
            <Grid item xs={12} md={9} />
          </Grid>
        </div>

        <Paper square style={{ background: 'primary', height: '12vh' }}>
          <Grid container style={{ height: '100%' }}>
            <Grid item xs={false} md={3} />

            <Grid
              item
              xs={12}
              md={6}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-end',
                height: '100%',
                width: '100%',
              }}
            >
              <Tabs
                style={{
                  display: 'flex',
                  justifyContent: 'right',
                }}
                value={this.state.value}
                indicatorColor="secondary"
                textColor="secondary"
                onChange={this.handleChange}
                fullWidth
              >
                <Tab label="Summary" />
                <Tab label="Trade" />
                <Tab label="Services" />
              </Tabs>
            </Grid>
            <Grid item md={3} className={classes.ContributeBox}>
              <Button
                color="secondary"
                size="large"
                variant="contained"
                onClick={() => this.setState({ value: 1 })}
              >
                CONTRIBUTE
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Content */}
        <Grid
          container
          spacing={16}
          style={{ padding: '4%', paddingTop: '16px', minHeight: '80vh' }}
        >
          <Grid item xs={12} md={3} className={classes.Box1}>
            <InfoCard
              contributors={this.state.contributors}
              marketCap={removeDecimals(removeDecimals(toBN(totalSupply).mul(currentPrice)))}
              socials={{
                twitter: 'https://convergent.cx',
                facebook: 'https://convergent.cx',
                instagram: 'https://convergent.cx',
              }}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={6} className={classes.Box2}>
            {this.state.value === 1 && (
              <Paper>
                <BuyAndSellButtons
                  contract={this.props.drizzle.contracts[this.props.addr]}
                  drizzleState={this.props.drizzleState}
                  symbol={this.state.symbol}
                />
                <Button
                  color="secondary"
                  size="small"
                  aria-owns={this.state.anchorEl ? 'simple-popper' : undefined}
                  aria-haspopup="true"
                  variant="outlined"
                  style={{ marginLeft: '5%', marginBottom: '5%' }}
                  onClick={this.handleExpandClick}
                >
                  Details
                </Button>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: 'primary',
                      padding: '11px',
                      fontSize: '11px',
                    }}
                  >
                    <Grid container>
                      <Grid item md={12}>
                        <Typography>
                          Contract Address:
                          {' ' + this.props.addr}
                        </Typography>
                      </Grid>
                      <Grid item md={12}>
                        <Typography>
                          Owner Address:
                          {' ' + this.state.owner}
                        </Typography>
                      </Grid>
                      <Grid item md={4}>
                        <Typography>
                          {' '}
                          Current Price:
                          {' ' + removeDecimals(currentPrice)} ETH
                        </Typography>
                      </Grid>
                      <Grid item md={4}>
                        <Typography>
                          {' '}
                          Reserve Pool:
                          {' ' + removeDecimals(this.state.poolBalance)} ETH{' '}
                        </Typography>
                      </Grid>
                      <Grid item md={4}>
                        <Typography>
                          {' '}
                          Total Supply:
                          {' ' + removeDecimals(totalSupply)} {this.state.symbol}
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                  <Grid container>
                    <Grid item sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: '100%', height: '33vh' }}>
                        <ProfileChart
                          curveData={{
                            totalSupply: totalSupply,
                            poolBalance: this.state.poolBalance,
                            inverseSlope: this.state.inverseSlope,
                            exponent: this.state.exponent,
                            currentPrice: currentPrice,
                          }}
                          margin={{
                            top: 30,
                            right: 10,
                            bottom: 30,
                            left: 10,
                          }}
                          width="100%"
                          height="100%"
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Collapse>
              </Paper>
            )}
            {this.state.value === 0 && (
              <Paper
                style={{
                  minHeight: '50vh',
                  padding: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant="subtitle1"
                  style={{
                    color: 'primary',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {this.state.name}'s story
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: 'bold',
                    color: 'primary',
                    height: '400px',
                  }}
                >
                  {this.state.description}
                </Typography>
              </Paper>
            )}
            {this.state.value === 2 && (
              <Paper style={{ minHeight: '50vh', padding: '2%' }}>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: 'primary',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  offered services
                </Typography>
                <ServiceDetails
                  dataJson={this.state.dataJson}
                  contract={this.props.drizzle.contracts[this.props.addr]}
                  drizzleState={this.props.drizzleState}
                />
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} md={3} className={classes.Box3}>
            <OwnerCard symbol={this.state.symbol} tokenBalance={yourBalance} />

            <ServicePanel
              dataJson={this.state.dataJson}
              contract={this.props.drizzle.contracts[this.props.addr]}
              drizzleState={this.props.drizzleState}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const ProfileDetailsContextualized = withContext(ProfileDetails);

const Profile = props => (
  <div>
    <ProfileDetailsContextualized
      addr={props.match.params.economyAddress}
      history={props.history}
    />
  </div>
);

export default Profile;
