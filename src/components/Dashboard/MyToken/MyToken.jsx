import React, { Component } from 'react';
import { Card, CardHeader, Button, CardBody, Row, Col } from 'reactstrap';
import classes from './MyToken.module.css';
import withContext from '../../../hoc/withContext';
import { withRouter } from 'react-router-dom';

import Events from './Events/Events';
import PersonalEconomy from '../../../build/contracts/PersonalEconomy.json';
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
      web3Contract: new drizzle.web3.eth.Contract(PersonalEconomy['abi'], this.props.address)
    };
    let drizzleEvents = ['Minted', 'Burned', 'Requested'];
    drizzle.addContract(contractConfig, drizzleEvents);
  }

  showDetails = () => {
    this.props.history.push('/tokens/' + this.props.address);
  };

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
      <Card id={this.props.address} className={classes.tokenBox}>
        <CardHeader>
          {this.props.name}
          <div className={classes.DetailsButton}>
            <Button color="secondary" size="sm" onClick={this.showDetails}>
              Details
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Events date={this.props.date} address={this.props.address} />
        </CardBody>
      </Card>
    );
  }
}

export default withContext(withRouter(MyTokens));
