import React, { Component } from 'react'
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import EthPolynomialCurvedToken from '../../../contracts/EthPolynomialCurvedToken.json';
import ContractInfo from './ContractInfo/ContractInfo';
import BuySell from './BuySell/BuySell';
import RequestService from './RequestService/RequestService';
import CurveChart from './Chart/Chart';


import withContext from '../../../hoc/withContext';

// @dev: this should become a container component that passes all necessary props down to the various presenter components

const multiplier = 10 ** 18;


class TokenDetails extends Component {

    state = {
        tokenContract: null,
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
        currentPrice: null,
        marketCap: null,
    }


    componentDidMount = async () => {
        const { drizzle } = this.props;
        const address = this.props.match.params.tokenAddress;
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
        this.setState({ drizzleContract: contract })

        const dataKeyTotalSupply = contract && contract.methods["totalSupply"].cacheCall()
        const dataKeyPoolBalance = contract && contract.methods["poolBalance"].cacheCall()
        const dataKeyTokenBalance = contract && contract.methods["balanceOf"].cacheCall(this.props.drizzleState.accounts[0])

        this.setState({
            dataKeyTotalSupply,
            dataKeyPoolBalance,
            dataKeyTokenBalance,
        });
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps !== this.props) {
            this.getContractData();
        }
    }

    getContractData = async () => {

        const contract = this.state.drizzleContract;
        console.log(contract)
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
        });
    }

    closeModal = () => {
        this.props.history.goBack()
    }

    render() {
        const account = this.props.drizzleState.accounts[0];
        const address = this.props.match.params.tokenAddress;
        const contract = this.props.drizzleState && this.props.drizzleState.contracts[address];
        const totalSupplyRes = contract && contract.totalSupply[this.state.dataKeyTotalSupply];
        const poolBalanceRes = contract && contract.poolBalance[this.state.dataKeyPoolBalance];
        console.log(poolBalanceRes);
        const tokenBalanceRes = contract && contract.balanceOf[this.state.dataKeyTokenBalance];

        const totalSupply = totalSupplyRes && totalSupplyRes.value / multiplier;
        const poolBalance = poolBalanceRes && poolBalanceRes.value / multiplier;
        const tokenBalance = tokenBalanceRes && tokenBalanceRes.value / multiplier;
        const currentPrice = (1 / this.state.invSlope) * (totalSupply) ** this.state.exponent;

        return (
            <Modal size="lg" isOpen={true} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    {this.state.name} ({this.state.symbol})
                </ModalHeader>
                <ModalBody>
                    <BuySell
                        contract={this.state.drizzleContract}
                        address={this.props.match.params.tokenAddress}
                        account={this.props.drizzleState.accounts[0]}
                        symbol={this.state.symbol}
                    />

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

                    <CurveChart curveData={{
                        totalSupply: totalSupply,
                        poolBalance: poolBalance,
                        invSlope: this.state.invSlope,
                        exponent: this.state.exponent,
                        currentPrice: currentPrice
                    }}
                        margin={{
                            top: 30,
                            right: 30,
                            bottom: 50,
                            left: 70,
                        }}
                        width={500}
                        height={400}
                    />
                </ModalBody>
                <RequestService
                    contract={this.state.drizzleContract}
                    account={account}
                    symbol={this.state.symbol}
                />
                <ModalFooter>
                </ModalFooter>
            </Modal>
        )
    }
}

export default withContext(TokenDetails);
