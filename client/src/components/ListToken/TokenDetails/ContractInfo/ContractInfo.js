import React, { Component } from 'react';
import CurveChart from '../Chart/Chart';

const multiplier = 10 ** 18;

class ContractInfo extends Component {


    state = {
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

    componentDidUpdate(prevProps) {
        if (prevProps.contract !== this.props.contract) {

            const { contract } = this.props;

            const dataKeyTotalSupply = contract && contract.methods["totalSupply"].cacheCall()
            const dataKeyPoolBalance = contract && contract.methods["poolBalance"].cacheCall()
            const dataKeyTokenBalance = contract && contract.methods["balanceOf"].cacheCall(this.props.account)

            this.setState({
                dataKeyTotalSupply,
                dataKeyPoolBalance,
                dataKeyTokenBalance,
            });

            this.getContractData();
        }
    }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.contract !== this.props.contract) {
    //         this.getContractData();
    //     }
    // }

    getContractData = async () => {
        const { contract } = this.props;

        let owner;
        let symbol;
        let name;
        let exponent;
        let invSlope;

        await contract && contract.methods.owner().call({ from: this.props.account }, (error, result) => {
            owner = result;
            this.setState({ owner: owner })
        });
        await contract && contract.methods.symbol().call({ from: this.props.account }, (error, result) => {
            symbol = result;
            this.setState({ symbol: symbol })
        });
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

        //     // @dev
        //     // It's random that the currentPrice is being set in the totalSupply call (it just needs to be in the last call, once all other necessary state variables have been set)
        //     // Would be better to get the currentPrice separately, but I couldnt figure out where in the lifecycle to do this.
        //     await contract && contract.methods.totalSupply().call({ from: this.props.account }, (error, result) => {
        //         totalSupply = result/multiplier;
        //         let currentPrice = (1 / this.state.invSlope) * (totalSupply) ** this.state.exponent;
        //         this.setState({ totalSupply: totalSupply, currentPrice: currentPrice })
        //     });
        //     await contract && contract.methods.poolBalance().call({ from: this.props.account }, (error, result) => {
        //         poolBalance = result/multiplier;
        //         this.setState({ poolBalance: poolBalance })
        //     });

        //     await contract && contract.methods.balanceOf(`${this.props.account}`).call({ from: this.props.account }, (error, result) => {
        //         tokenBalance = result/multiplier;
        //         this.setState({ tokenBalance: tokenBalance })
        //     });
    }

    render() {

        // const totalSupply = this.props.contract && this.props.contract.totalSupply[this.state.dataKey];
        const contract = this.props.drizzleState.contracts[this.props.address] && this.props.drizzleState.contracts[this.props.address];

        const totalSupplyRes = contract && contract.totalSupply[this.state.dataKeyTotalSupply];
        const poolBalanceRes = contract && contract.poolBalance[this.state.dataKeyPoolBalance];
        const tokenBalanceRes = contract && contract.balanceOf[this.state.dataKeyTokenBalance];

        const totalSupply = totalSupplyRes && totalSupplyRes.value / multiplier;
        const poolBalance = poolBalanceRes && poolBalanceRes.value / multiplier;
        const tokenBalance = tokenBalanceRes && tokenBalanceRes.value / multiplier;

        const currentPrice = (1 / this.state.invSlope) * (totalSupply) ** this.state.exponent;

        return (
            <div>
                <p>Token Address: {this.props.address}</p>
                <p>Token Owner: {this.state.owner}</p>
                <p> Token Symbol: {this.state.symbol}</p>
                <p> Name/Project: {this.state.name}</p>
                <p> Your Token Balance: {tokenBalance}</p>
                <p> Bonding Curve Function: p = 1/{this.state.invSlope} * x ^ {this.state.exponent}</p>
                <p> Pool Balance: {poolBalance}</p>
                <p> Total Supply: {totalSupply}</p>
                <p> Current Price: {currentPrice}</p>
                <p> Market Cap: {totalSupply * currentPrice}</p>

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

                {/* <CurveChart curveData={{
                    totalSupply: 1000,
                    poolBalance: 500,
                    invSlope: 1000,
                    exponent: 1,
                    currentPrice: 1
                }}
                /> */}

            </div>
        )
    }
}

export default ContractInfo;