import React, { Component } from 'react';
import EthPolynomialCurvedToken from '../../contracts/EthPolynomialCurvedToken.json';
import Web3 from 'web3';
import { Table } from 'reactstrap';

class Dashboard extends Component {

    state = {
        contract: null,
        events: null
    }

    componentDidMount = () => {
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        const contract = new web3.eth.Contract(EthPolynomialCurvedToken['abi'], "0xB59830F06B1e8057749A834b6E64e943dce42cD7");
        this.setState({ contract });
        contract.getPastEvents("allEvents", { fromBlock: 0, toBlock: "latest" }, (err, events) => { this.setState({ events })});
    }
    render() {
        console.log(this.state.events);
        const rows = this.state.events && this.state.events.map(event=> (
            <tr>
                <td>{event.event}</td>
                <td>{(new Date(event.returnValues.time*1000)).toDateString()}</td>
                <td>{event.returnValues.message}</td>
                <td>{event.returnValues.price}</td>

            </tr>
        ))

        return (
            <Table>
                {rows}
            </Table>
        )
    }

}

export default Dashboard