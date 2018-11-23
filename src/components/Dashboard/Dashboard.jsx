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
import PersonalEconomyFactory from "../../build/contracts/PersonalEconomyFactory.json";
import Sidebar from './Sidebar/Sidebar'
import MyToken from './MyToken/MyToken'
import classes from './Dashboard.module.css';

import withContext from '../../hoc/withContext';

const multiplier = 10 ** 18;


class Dashboard extends Component {

    state = {
        tokens: null,
        web3Contract: null,
        tokenContract: null,
        eventsArray: [],
        tokenPurchaseAmount: null,
        price: null,
        reward: null,
        owner: '',
        symbol: '',
        name: '',
        exponent: null,
        inverseSlope: null,
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
        const { drizzle, drizzleState } = this.props;
        const factoryAddress = drizzle.contracts.PersonalEconomyFactory.address
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        const factoryContract = new web3.eth.Contract(PersonalEconomyFactory['abi'], factoryAddress);


        // WEB3 WAY OF GETTING CURRENTLY ACTIVE ACCOUNTS AND TOKEN ADDRESSES

        // web3.eth.getAccounts().then(e => { // which addresses does this really return??
        //     let tokens = e.map((address) => { 
        //         let filter =  {'owner_address': address};
        //         factoryContract.getPastEvents("Created", { fromBlock: 0, toBlock: "latest", filter}, (err, events) => { console.log(events)});
        //      })
        //     console.log(tokens)

        // })

        let filter = { 'owner_address': drizzleState.accounts[0] };
        let tokens = [];
        factoryContract.getPastEvents("Created", { fromBlock: 0, toBlock: "latest", filter }, (err, events) => {
            events.forEach(token => {
                let address = token.returnValues.token_address;
                let date = token.returnValues.time;
                let name = token.returnValues.name;
                tokens.push({ address, date, name });
                this.setState({ tokens })
            });
        });



        // const contract = drizzle.contracts[address];
        // this.setState({ drizzleContract: contract }, () => {
        //     this.getMenu();
        //     console.log(this.state.drizzleContract)

        // })
        // this.setState({ web3Contract });

    }

    // componentDidUpdate = (prevProps, prevState) => {
    //     if (prevProps !== this.props) {
    //         this.getContractData();
    //     }
    //     if (prevState.prices !== this.state.prices) {
    //         const contract = this.state.drizzleContract;
    //         const dataKeyTotalSupply = contract && contract.methods["totalSupply"].cacheCall();
    //         const dataKeyPoolBalance = contract && contract.methods["poolBalance"].cacheCall();
    //         const dataKeyTokenBalance = contract && contract.methods["balanceOf"].cacheCall(this.props.drizzleState.accounts[0]);
    //         const dataKeyRequestPrice1 = contract && contract.methods["priceToMint"].cacheCall(`${this.state.prices.price1 * multiplier}`);
    //         const dataKeyRequestPrice2 = contract && contract.methods["priceToMint"].cacheCall(`${this.state.prices.price2 * multiplier}`);
    //         const dataKeyRequestPrice3 = contract && contract.methods["priceToMint"].cacheCall(`${this.state.prices.price3 * multiplier}`);


    //         this.setState({
    //             dataKeyTotalSupply,
    //             dataKeyPoolBalance,
    //             dataKeyTokenBalance,
    //             dataKeyRequestPrice1,
    //             dataKeyRequestPrice2,
    //             dataKeyRequestPrice3
    //         });
    //     }
    // }

    // getContractData = async () => {

    //     const contract = this.state.drizzleContract;
    //     const account = this.props.drizzleState.accounts[0];
    //     let owner;
    //     let symbol;
    //     let name;
    //     let exponent;
    //     let inverseSlope;

    //     await contract && contract.methods.owner().call({ from: account }, (error, result) => {
    //         owner = result;
    //         this.setState({ owner: owner })
    //     });
    //     await contract && contract.methods.symbol().call({ from: account }, (error, result) => {
    //         symbol = result;
    //         this.setState({ symbol: symbol })
    //     });
    //     await contract && contract.methods.name().call({ from: account }, (error, result) => {
    //         name = result;
    //         this.setState({ name: name })
    //     });
    //     await contract && contract.methods.exponent().call({ from: account }, (error, result) => {
    //         exponent = result;
    //         this.setState({ exponent: exponent })
    //     });
    //     await contract && contract.methods.inverseSlope().call({ from: account }, (error, result) => {
    //         inverseSlope = result;
    //         this.setState({ inverseSlope: inverseSlope })
    //         console.log(contract)
    //     });
    // }


    // getMenu = async () => {
    //     const contract = this.state.drizzleContract;

    //     await contract && contract.methods.action1().call({ from: this.props.account }, (error, result) => {
    //         let actions = { ...this.state.actions }
    //         actions.action1 = result;
    //         this.setState({ actions })
    //     });

    //     await contract && contract.methods.action2().call({ from: this.props.account }, (error, result) => {
    //         let actions = { ...this.state.actions }
    //         actions.action2 = result;
    //         this.setState({ actions })
    //     });

    //     await contract && contract.methods.action3().call({ from: this.props.account }, (error, result) => {
    //         let actions = { ...this.state.actions }
    //         actions.action3 = result;
    //         this.setState({ actions })
    //     });

    //     await contract && contract.methods.prices(0).call({ from: this.props.account }, (error, result) => {
    //         let prices = { ...this.state.prices }
    //         prices.price1 = result;
    //         this.setState({ prices })
    //     });

    //     await contract && contract.methods.prices(1).call({ from: this.props.account }, (error, result) => {
    //         let prices = { ...this.state.prices }
    //         prices.price2 = result;
    //         this.setState({ prices })
    //     });

    //     await contract && contract.methods.prices(2).call({ from: this.props.account }, (error, result) => {
    //         let prices = { ...this.state.prices }
    //         prices.price3 = result;
    //         this.setState({ prices })
    //     });
    // }


    // toggle = () => {
    //     this.setState({
    //         popoverOpen: !this.state.popoverOpen
    //     });
    // }

    render() {
        // const account = this.props.drizzleState.accounts[0];
        // const { address } = this.state;
        // const contract = this.props.drizzleState && this.props.drizzleState.contracts[address];
        // const totalSupplyRes = contract && contract.totalSupply[this.state.dataKeyTotalSupply];
        // const poolBalanceRes = contract && contract.poolBalance[this.state.dataKeyPoolBalance];
        // const tokenBalanceRes = contract && contract.balanceOf[this.state.dataKeyTokenBalance];
        // const requestPrice1Res = contract && contract.priceToMint[this.state.dataKeyRequestPrice1];
        // const requestPrice1 = requestPrice1Res && (requestPrice1Res.value / multiplier).toFixed(3);
        // const requestPrice2Res = contract && contract.priceToMint[this.state.dataKeyRequestPrice2];
        // const requestPrice2 = requestPrice2Res && (requestPrice2Res.value / multiplier).toFixed(3);
        // const requestPrice3Res = contract && contract.priceToMint[this.state.dataKeyRequestPrice3];
        // const requestPrice3 = requestPrice3Res && (requestPrice3Res.value / multiplier).toFixed(3);


        // const totalSupply = totalSupplyRes && totalSupplyRes.value / multiplier;
        // const poolBalance = poolBalanceRes && poolBalanceRes.value / multiplier;
        // const tokenBalance = tokenBalanceRes && tokenBalanceRes.value / multiplier;
        // const currentPrice = (1 / this.state.inverseSlope) * (totalSupply) ** this.state.exponent;



        const tokens = this.state.tokens && this.state.tokens.map((token) => {
            return (<MyToken
                address={token.address}
                date={token.date}
                name={token.name}
                key={token.address}
            />
            )
        });

        return (
            <div className={classes.rowC}>
                <Sidebar/>
                <Container>
                    {tokens}
                </Container>
            </div>
        )
    }
}

export default withContext(Dashboard);
