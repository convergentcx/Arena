import Web3 from 'web3';
import React, { Component } from 'react';
import PersonalEconomy from '../../../../build/contracts/PersonalEconomy.json';
import classes from './Events.module.css';
import { Row, Col, Tooltip } from 'reactstrap';

const multiplier = 10 ** 18;

class Events extends Component {
  state = {
    eventsArray: [],
    tooltipOpen: false
  };

  componentDidMount() {
    // @DEV NOT SURE IF WE CAN GET EVENTS FROM DRIZZLE; WOULD BE BETTER NOT TO HAVE TO INSTANTIATE THE SAME CONTRACT
    // WITH WEB3
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

    const web3Contract = new web3.eth.Contract(PersonalEconomy['abi'], this.props.address);
    let eventsArray = [];
    web3Contract.getPastEvents('allEvents', { fromBlock: 0, toBlock: 'latest' }, (err, events) => {
      eventsArray.push(events);
      this.setState({ eventsArray });
      // console.log(eventsArray);
    });
  }

  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  };

  render() {
    const rows =
      this.state.eventsArray[0] &&
      this.state.eventsArray[0].map(event => {
        return (
          <tr key={event.transactionHash}>
            <td>
              {event.returnValues.time && new Date(event.returnValues.time * 1000).toDateString()}
            </td>
            <td>{event.event}</td>
            <td>{event.returnValues.who && event.returnValues.who}</td>
            <td>{event.returnValues.message ? event.returnValues.message : ''}</td>
            <td>{event.returnValues.amount ? event.returnValues.amount / multiplier : ''}</td>
            <td>{event.returnValues.totalCost ? event.returnValues.totalCost / multiplier : ''}</td>
          </tr>
        );
      });

    return (
      <table className={classes.events}>
        <tr>
          <th className={classes.rowDate}> Date </th>
          <th className={classes.rowEvent}> Event </th>
          <th className={classes.rowAddress}> From </th>
          <th className={classes.rowMessage}> Message </th>
          <th className={classes.rowAmount}> Token Amount </th>
          <th className={classes.rowAmount}> Ether Amount </th>
        </tr>
        <tr>
          <td>{new Date(this.props.date * 1000).toDateString()}</td>
          <td>Created</td>
        </tr>

        {rows}
      </table>
    );
  }
}

export default Events;
