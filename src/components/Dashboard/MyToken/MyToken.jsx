import React, { Component } from 'react';
import { Card } from 'reactstrap';
import withContext from '../../../hoc/withContext';

import Events from './Events/Events';
import EthPolynomialCurvedToken from '../../../build/contracts/EthPolynomialCurvedToken.json';
import ContractInfo from '../../ListToken/TokenDetails/ContractInfo/ContractInfo';
// import BuySell from '../ListToken/TokenDetails/BuySell/BuySell';
// import RequestService from '../ListToken/TokenDetails/RequestService/RequestService';
// import CurveChart from '../ListToken/TokenDetails/Chart/Chart';

// import classes from '../ListToken/TokenDetails/TokenDetails.module.css';

class MyTokens extends Component {
  componentDidMount() {
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
  }

  render() {
    // const rows = this.state.eventsArray && this.state.eventsArray.map(tokenEvents => (
    //     <table>
    //         {tokenEvents.map(event => (
    //             <tr>
    //                 <td>{event.event}</td>
    //                 <td>{event.returnValues && (new Date(event.returnValues.time * 1000)).toDateString()}</td>
    //                 <td>{event.returnValues && event.returnValues.message}</td>
    //                 <td>{event.returnValues && event.returnValues.price}</td>
    //             </tr>)}
    //     </table>
    // )
    // ))

    //     console.log(rows)

    // const rows = this.state.eventsArray.map(event => {
    //     console.log(event.returnValues && event.returnValues.time)
    // })

    return (
      <Card>
        {this.props.address}
        <Events address={this.props.address} />
      </Card>
    );
  }
}

export default withContext(MyTokens);
