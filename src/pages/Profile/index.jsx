import React, { Component } from 'react';
import ipfsApi from 'ipfs-api';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Grid,
  Popover,
  Typography
} from '@material-ui/core';
import { KeyboardBackspace } from '@material-ui/icons';

import PersonalEconomy from '../../build/contracts/PersonalEconomy.json';

import withContext from '../../hoc/withContext';

import BuyAndSellButtons from '../../components/Profile/BuyAndSellButtons.jsx';
import Details from '../../components/Profile/Details.jsx';
import ProfileChart from '../../components/Profile/ProfileChart.jsx';
import Services from '../../components/Profile/Services.jsx';

import { CardMedia } from '@material-ui/core';

import { getMultihashFromBytes32, getPrice, removeDecimals } from '../../util';
import { utils } from 'web3';

const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

const multiplier = 10 ** 18;

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
      symbol: ''
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
      size: 32,
    });

    const dataJson = JSON.parse((await ipfs.get(multihash))[0].content.toString());
    
    const { description, image, name, symbol } = dataJson;
    const pic = Buffer.from(image.data).toString('base64');

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
      symbol
    });
  }

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
            <KeyboardBackspace style={{ color: 'white' }} />
          </IconButton>
          <div style={{ flexGrow: 1 }} />
          <Typography variant="title" style={{ color: 'white' }}>
            Personal Economy of {this.state.name}
          </Typography>
        </Grid>

        <Grid container>
          <Grid container>
            <Grid item md={6}>
              <Card style={{ margin: '6px' }}>
                <CardMedia
                  alt="photo"
                  image={'data:image/jpeg;base64,' + this.state.pic}
                  style={{ height: '0', paddingTop: '56.25%' }}
                />
                <CardHeader title={`About ${this.state.name}`} />
                <CardContent>
                  {this.state.description}
                </CardContent>
              </Card>
            </Grid>

            <Grid item md={6}>
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
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <Card style={{ width: '440px', padding: '11px', fontSize: '11px' }}>
              <CardHeader title="Contract Information" style={{ textAlign: 'center' }} />
              <CardContent
                style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
              >
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

          <Services
            account={this.props.drizzleState.accounts[0]}
            contract={this.props.drizzle.contracts[this.props.addr]}
            drizzleState={this.props.drizzleState}
            dataJson={this.state.dataJson}
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
