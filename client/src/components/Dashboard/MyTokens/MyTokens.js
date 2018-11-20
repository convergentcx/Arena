
import Web3 from 'web3';
import React, { Component } from 'react';
import withContext from '../../../hoc/withContext';


import EthPolynomialCurvedToken from '../../../contracts/EthPolynomialCurvedToken.json';
// import ContractInfo from '../ListToken/TokenDetails/ContractInfo/ContractInfo';
// import BuySell from '../ListToken/TokenDetails/BuySell/BuySell';
// import RequestService from '../ListToken/TokenDetails/RequestService/RequestService';
// import CurveChart from '../ListToken/TokenDetails/Chart/Chart';

// import classes from '../ListToken/TokenDetails/TokenDetails.module.css';


class MyTokens extends Component {
    state = {
        eventsArray: []
    }
    componentDidMount() {
        const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        const { drizzle } = this.props;
        const contractConfig = {
            contractName: this.props.address,
            web3Contract: new drizzle.web3.eth.Contract(
                EthPolynomialCurvedToken['abi'],
                this.props.address
            )
        };
        let drizzleEvents = ['Minted', 'Burned', 'Requested'];
        drizzle.addContract(contractConfig, drizzleEvents);
        const web3Contract = new web3.eth.Contract(EthPolynomialCurvedToken['abi'], this.props.address);

        let eventsArray = [];
        web3Contract.getPastEvents("allEvents", { fromBlock: 0, toBlock: "latest" }, (err, events) => {
            eventsArray.push(events);
            console.log(eventsArray)
            this.setState({ eventsArray })
        })
    }

    render() {

        const rows = this.state.eventsArray && this.state.eventsArray.map(event => (
            <tr>
                <td>{event.event}</td>
                <td>{(new Date(event.returnValues.time * 1000)).toDateString()}</td>
                <td>{event.returnValues.message}</td>
                <td>{event.returnValues.price}</td>

            </tr>
        ))

        return(
            <div>
                {rows}
            </div>
        )
    }
}

export default withContext(MyTokens);









