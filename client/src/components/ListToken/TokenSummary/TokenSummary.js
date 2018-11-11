import React, { Component } from 'react'
import EthPolynomialCurvedToken from '../../../contracts/EthPolynomialCurvedToken.json';
import { withRouter } from 'react-router-dom';

const multiplier = 10 ** 18;


class TokenSummary extends Component {


    state = {
        drizzleContract: null,
        dataKeyTotalSupply: null,
        dataKeyTokenBalance: null,
        currentPrice: null,
        marketCap: null,
        action1: '',
        action2: '',
        action3: '',
    }

    componentDidMount = async () => {
        const { drizzle, address } = this.props;
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

        const dataKeyTotalSupply = contract && contract.methods["totalSupply"].cacheCall();
        this.setState({ dataKeyTotalSupply });

        // WITHOUT DRIZZLE / USING PLAIN WEB3
        // try {

        // var web3 = await new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        // const contract_instance = await new web3.eth.Contract(abi, this.props.address);
        // this.setState({tokenContract: contract_instance});
        // } catch (error) {
        //     // Catch any errors for any of the above operations.
        //     alert(
        //       `Failed to load web3, accounts, or contract. Check console for details.`
        //     );
        //     console.log(error);
        //   }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.drizzleContract !== this.state.drizzleContract) {
            this.getFixedTokenSummaryData();
        }
    }

    //change this to drizzle, so that changes update live even in the overview
    getFixedTokenSummaryData = async () => {
        const contract = this.state.drizzleContract;

        let name;
        let exponent;
        let invSlope;
        let totalSupply;
        let tokenBalance;
        let action1 = '';
        let action2 = '';
        let action3 = '';

        await contract && contract.methods.name().call({ from: this.props.account }, (error, result) => {
            name = result;
            this.setState({ name: name })
        });
        await contract && contract.methods.exponent().call({ from: this.props.account }, (error, result) => {
            exponent = result;
            this.setState({ exponent: exponent })
        });
        await contract && contract.methods.invSlope().call({ from: this.props.account }, (error, result) => {
            invSlope = result;
            this.setState({ invSlope: invSlope })
        });

        await contract && contract.methods.totalSupply().call({ from: this.props.account }, (error, result) => {
            totalSupply = result / multiplier;
            let currentPrice = (1 / this.state.invSlope) * (totalSupply) ** this.state.exponent;
            this.setState({ totalSupply: totalSupply, currentPrice: currentPrice })
        });

        await contract && contract.methods.balanceOf(`${this.props.account}`).call({ from: this.props.account }, (error, result) => {
            tokenBalance = result / multiplier;
            this.setState({ tokenBalance: tokenBalance })
        });

        await contract && contract.methods.action1().call({ from: this.props.account }, (error, result) => {
            action1 = result;
            this.setState({ action1: action1 })
        });

        await contract && contract.methods.action2().call({ from: this.props.account }, (error, result) => {
            action2 = result;
            this.setState({ action2: action2 })
        });

        await contract && contract.methods.action3().call({ from: this.props.account }, (error, result) => {
            action3 = result;
            this.setState({ action3: action3 })
        });
    }

    showDetails = () => {
        this.props.history.push('/tokens/' + this.props.address);
    }


    render() {
        const contract = this.props.drizzleState.contracts[this.props.address];
        const totalSupplyRes = contract && contract.totalSupply[this.state.dataKeyTotalSupply];
        const totalSupply = totalSupplyRes && totalSupplyRes.value / multiplier;
        const currentPrice = (1 / this.state.invSlope) * (totalSupply) ** this.state.exponent;
        return (
            <tr onClick={this.showDetails}>
                <td>{this.state.name}</td>
                <td>{currentPrice}</td>
                <td>{currentPrice * totalSupply}</td>
                <td>{this.state.action1}, {this.state.action2}, {this.state.action3}</td>
            </tr>

        )
    }
}

export default withRouter(TokenSummary);
