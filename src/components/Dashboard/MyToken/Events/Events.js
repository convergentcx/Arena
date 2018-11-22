
import Web3 from 'web3';
import React, { Component } from 'react';
import EthPolynomialCurvedToken from '../../../../build/contracts/EthPolynomialCurvedToken.json';


class Events extends Component {


    state = {
        eventsArray: []
    }

    componentDidMount() {
        // @DEV NOT SURE IF WE CAN GET EVENTS FROM DRIZZLE; WOULD BE BETTER NOT TO HAVE TO INSTANTIATE THE SAME CONTRACT 
        // WITH WEB3
        const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

        const web3Contract = new web3.eth.Contract(EthPolynomialCurvedToken['abi'], this.props.address);
        let eventsArray = [];
        web3Contract.getPastEvents("allEvents", { fromBlock: 0, toBlock: "latest" }, (err, events) => {
            eventsArray.push(events);
            this.setState({ eventsArray })
        })
    }

    render() {
        const rows = this.state.eventsArray[0] && this.state.eventsArray[0].map(event => {
            return (
            <tr key={event.transactionHash}>
                <td>{event.event}</td>
                <td>{event.returnValues && (new Date(event.returnValues.time * 1000)).toDateString()}</td>
                <td>{event.returnValues && event.returnValues.message}</td>
                <td>{event.returnValues && event.returnValues.price}</td>
            </tr>
    )})


            return (
                <table>
                {rows}
                    </table>
            )
    }
}

export default Events;