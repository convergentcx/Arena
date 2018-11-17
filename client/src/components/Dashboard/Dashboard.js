import Web3 from 'web3';
import React, { Component } from 'react'
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
    CardHeader,
    CardBody,
    CardText,
    Button,
    Container,
    Row,
    Col,
    Popover,
    PopoverHeader,
    PopoverBody,
    FormGroup,
    Label,
    Table
} from 'reactstrap';

import EthPolynomialCurvedToken from '../../contracts/EthPolynomialCurvedToken.json';
import ContractInfo from '../ListToken/TokenDetails/ContractInfo/ContractInfo';
import BuySell from '../ListToken/TokenDetails/BuySell/BuySell';
import RequestService from '../ListToken/TokenDetails/RequestService/RequestService';
import CurveChart from '../ListToken/TokenDetails/Chart/Chart';

import classes from '../ListToken/TokenDetails/TokenDetails.module.css';


import withContext from '../../hoc/withContext';

// @dev: this should become a container component that passes all necessary props down to the various presenter components

const multiplier = 10 ** 18;



class Dashboard extends Component {

    state = {
        address: '0xf31e78FCc8f38135D02B3b3D372e4a7f949ec41C', // THIS IS NOT  DYNAMIC, NEED A WAY TO FIND WHICH TOKEN BELONGS TO CURRENT USER!
        web3Contract: null,
        tokenContract: null,
        events: null,
        tokenPurchaseAmount: null,
        price: null,
        reward: null,
        owner: '',
        symbol: '',
        name: '',
        exponent: null,
        invSlope: null,
        dataKeyTotalSupply: null,
        dataKeyPoolBalance: null,
        dataKeyTokenBalance: null,
        dataKeyRequestPrice1: null,
        currentPrice: null,
        marketCap: null,
        actions: {
            action1: '',
            action2: '',
            action3: ''
        },
        prices: {
            price1: '',
            price2: '',
            price3: '',
        },
        popoverOpen: false
    }


    componentDidMount = async () => {
        const { drizzle } = this.props;
        const { address } = this.state;
        const contractConfig = {
            contractName: address,
            web3Contract: new drizzle.web3.eth.Contract(
                EthPolynomialCurvedToken['abi'],
                address
            )
        };
        let events = ['Minted', 'Burned'];
        await drizzle.addContract(contractConfig, events);
        const contract = drizzle.contracts[address];
        this.setState({ drizzleContract: contract }, () => {
            this.getMenu();
            console.log(this.state.drizzleContract)

        })
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        const web3Contract = new web3.eth.Contract(EthPolynomialCurvedToken['abi'], "0xf31e78FCc8f38135D02B3b3D372e4a7f949ec41C");
        this.setState({ web3Contract });
        web3Contract.getPastEvents("allEvents", { fromBlock: 0, toBlock: "latest" }, (err, events) => { this.setState({ events })});
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps !== this.props) {
            this.getContractData();
        }
        if (prevState.prices !== this.state.prices) {
            const contract = this.state.drizzleContract;
            const dataKeyTotalSupply = contract && contract.methods["totalSupply"].cacheCall();
            const dataKeyPoolBalance = contract && contract.methods["poolBalance"].cacheCall();
            const dataKeyTokenBalance = contract && contract.methods["balanceOf"].cacheCall(this.props.drizzleState.accounts[0]);
            const dataKeyRequestPrice1 = contract && contract.methods["priceToMint"].cacheCall(`${this.state.prices.price1 * multiplier}`);
            const dataKeyRequestPrice2 = contract && contract.methods["priceToMint"].cacheCall(`${this.state.prices.price2 * multiplier}`);
            const dataKeyRequestPrice3 = contract && contract.methods["priceToMint"].cacheCall(`${this.state.prices.price3 * multiplier}`);


            this.setState({
                dataKeyTotalSupply,
                dataKeyPoolBalance,
                dataKeyTokenBalance,
                dataKeyRequestPrice1,
                dataKeyRequestPrice2,
                dataKeyRequestPrice3
            });
        }
    }

    getContractData = async () => {
        
        const contract = this.state.drizzleContract;
        const account = this.props.drizzleState.accounts[0];
        let owner;
        let symbol;
        let name;
        let exponent;
        let invSlope;

        await contract && contract.methods.owner().call({ from: account }, (error, result) => {
            owner = result;
            this.setState({ owner: owner })
        });
        await contract && contract.methods.symbol().call({ from: account }, (error, result) => {
            symbol = result;
            this.setState({ symbol: symbol })
        });
        await contract && contract.methods.name().call({ from: account }, (error, result) => {
            name = result;
            this.setState({ name: name })
        });
        await contract && contract.methods.exponent().call({ from: account }, (error, result) => {
            exponent = result;
            this.setState({ exponent: exponent })
        });
        await contract && contract.methods.invSlope().call({ from: account }, (error, result) => {
            invSlope = result;
            this.setState({ invSlope: invSlope })
            console.log(contract)
        });
    }


    getMenu = async () => {
        const contract = this.state.drizzleContract;

        await contract && contract.methods.action1().call({ from: this.props.account }, (error, result) => {
            let actions = { ...this.state.actions }
            actions.action1 = result;
            this.setState({ actions })
        });

        await contract && contract.methods.action2().call({ from: this.props.account }, (error, result) => {
            let actions = { ...this.state.actions }
            actions.action2 = result;
            this.setState({ actions })
        });

        await contract && contract.methods.action3().call({ from: this.props.account }, (error, result) => {
            let actions = { ...this.state.actions }
            actions.action3 = result;
            this.setState({ actions })
        });

        await contract && contract.methods.prices(0).call({ from: this.props.account }, (error, result) => {
            let prices = { ...this.state.prices }
            prices.price1 = result;
            this.setState({ prices })
        });

        await contract && contract.methods.prices(1).call({ from: this.props.account }, (error, result) => {
            let prices = { ...this.state.prices }
            prices.price2 = result;
            this.setState({ prices })
        });

        await contract && contract.methods.prices(2).call({ from: this.props.account }, (error, result) => {
            let prices = { ...this.state.prices }
            prices.price3 = result;
            this.setState({ prices })
        });
    }


    toggle = () => {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        const account = this.props.drizzleState.accounts[0];
        const { address } = this.state;
        const contract = this.props.drizzleState && this.props.drizzleState.contracts[address];
        const totalSupplyRes = contract && contract.totalSupply[this.state.dataKeyTotalSupply];
        const poolBalanceRes = contract && contract.poolBalance[this.state.dataKeyPoolBalance];
        const tokenBalanceRes = contract && contract.balanceOf[this.state.dataKeyTokenBalance];
        const requestPrice1Res = contract && contract.priceToMint[this.state.dataKeyRequestPrice1];
        const requestPrice1 = requestPrice1Res && (requestPrice1Res.value / multiplier).toFixed(3);
        const requestPrice2Res = contract && contract.priceToMint[this.state.dataKeyRequestPrice2];
        const requestPrice2 = requestPrice2Res && (requestPrice2Res.value / multiplier).toFixed(3);
        const requestPrice3Res = contract && contract.priceToMint[this.state.dataKeyRequestPrice3];
        const requestPrice3 = requestPrice3Res && (requestPrice3Res.value / multiplier).toFixed(3);


        const totalSupply = totalSupplyRes && totalSupplyRes.value / multiplier;
        const poolBalance = poolBalanceRes && poolBalanceRes.value / multiplier;
        const tokenBalance = tokenBalanceRes && tokenBalanceRes.value / multiplier;
        const currentPrice = (1 / this.state.invSlope) * (totalSupply) ** this.state.exponent;

        const rows = this.state.events && this.state.events.map(event=> (
            <tr>
                <td>{event.event}</td>
                <td>{(new Date(event.returnValues.time*1000)).toDateString()}</td>
                <td>{event.returnValues.message}</td>
                <td>{event.returnValues.price}</td>

            </tr>
        ))

        return (
            <div>
                <Table>
                {rows}
            </Table>
                <div>
                    <Container>
                        <BuySell
                            contract={this.state.drizzleContract}
                            address={this.props.match.params.tokenAddress}
                            account={this.props.drizzleState.accounts[0]}
                            symbol={this.state.symbol}
                        />
                        <Row className={classes.Row}>
                            <Col md="6">
                                <ContractInfo
                                    address={this.props.match.params.tokenAddress}
                                    account={account}
                                    owner={this.state.owner}
                                    symbol={this.state.symbol}
                                    name={this.state.name}
                                    exponent={this.state.exponent}
                                    invSlope={this.state.invSlope}
                                    totalSupply={totalSupply}
                                    poolBalance={poolBalance}
                                    tokenBalance={tokenBalance}
                                    currentPrice={currentPrice}
                                    marketCap={currentPrice * totalSupply}
                                />
                            </Col>
                            <Col md="6">

                                <Card>
                                    <CardHeader> Bonding Curve
                                        <div className={classes.PopOverButton}>
                                            <Button color="secondary" size="sm" id="Popover1" onClick={this.toggle}>
                                                Details
                                            </Button>
                                        </div>
                                        <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
                                            <PopoverHeader>Contract Information</PopoverHeader>
                                            <PopoverBody>
                                                <Row>
                                                <Col md={12}>
                                                <FormGroup>
                                                <Label size="sm" className={classes.Label}>Contract Address</Label>
                                                <p> {address} </p>
                                                </FormGroup>
                                                </Col>
                                                </Row>
                                                <Row>
                                                <Col md={12}>
                                                <Label size="sm" className={classes.Label}>Owner Address</Label>
                                                <p>{this.state.owner}</p>
                                                </Col>
                                                </Row>
                                                <Row>
                                                <Col md={4}>
                                                <Label size="sm" className={classes.Label}>Price</Label>
                                                <p>{currentPrice} ETH</p>
                                                </Col>
                                                <Col md={4}>
                                                <Label size="sm" className={classes.Label}>Reserve Pool</Label>
                                                <p>{poolBalance} ETH </p>
                                                </Col>
                                                <Col md={4}>
                                                <Label size="sm" className={classes.Label}>Total Supply</Label>
                                                <p>{totalSupply} {this.state.symbol}</p>
                                                </Col>
                                                </Row>

                                            </PopoverBody>
                                        </Popover>
                                    </CardHeader>

                                    <CurveChart curveData={{
                                        totalSupply: totalSupply,
                                        poolBalance: poolBalance,
                                        invSlope: this.state.invSlope,
                                        exponent: this.state.exponent,
                                        currentPrice: currentPrice
                                    }}
                                        margin={{
                                            top: 30,
                                            right: 10,
                                            bottom: 30,
                                            left: 10,
                                        }}
                                        width={300}
                                        height={300}
                                    />
                                </Card>
                            </Col>
                        </Row>
                        <RequestService
                            contract={this.state.drizzleContract}
                            account={account}
                            symbol={this.state.symbol}
                            requestPrices={{
                                requestPrice1: requestPrice1,
                                requestPrice2: requestPrice2,
                                requestPrice3: requestPrice3
                            }}
                            prices={this.state.prices}
                            actions={this.state.actions}
                        />
                    </Container>

                </div>
            </div>
        )
    }
}

export default withContext(Dashboard);
