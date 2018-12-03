import Web3 from 'web3';
import PersonalEconomy from '../../../../build/contracts/PersonalEconomy.json';
// import classes from './Events.module.css';

import React from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const multiplier = 10 ** 18;

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
});

// let id = 0;
// function createData(name, calories, fat, carbs, protein) {
//   id += 1;
//   return { id, name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9)
// ];

class Events extends React.Component {
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

  render() {
    const { classes } = this.props;
    const rows =
      this.state.eventsArray[0] &&
      this.state.eventsArray[0].map(row => {
        return (
          <TableRow key={row.transactionHash}>
            <TableCell component="th" scope="row">
              {row.event}
            </TableCell>
            <TableCell>
              {row.returnValues.time && new Date(row.returnValues.time * 1000).toDateString()}
            </TableCell>
            <TableCell>{row.returnValues.who && row.returnValues.who}</TableCell>
            <TableCell>{row.returnValues.message ? row.returnValues.message : ''}</TableCell>
            <TableCell numeric>
              {row.returnValues.amount ? row.returnValues.amount / multiplier : ''}
            </TableCell>
            <TableCell numeric>
              {row.returnValues.totalCost ? row.returnValues.totalCost / multiplier : ''}
            </TableCell>
          </TableRow>
        );
      });

    // .map(event => {
    //   return (
    //     <tr key={event.transactionHash}>
    //       <td>
    //         {event.returnValues.time && new Date(event.returnValues.time * 1000).toDateString()}
    //       </td>
    //       <td>{event.event}</td>
    //       <td>{event.returnValues.who && event.returnValues.who}</td>
    //       <td>{event.returnValues.message ? event.returnValues.message : ''}</td>
    //       <td>{event.returnValues.amount ? event.returnValues.amount / multiplier : ''}</td>
    //       <td>{event.returnValues.totalCost ? event.returnValues.totalCost / multiplier : ''}</td>
    //     </tr>
    //   );
    // });

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>From address</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Token amount</TableCell>
              <TableCell> ETH amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(Events);

// import Web3 from 'web3';
// import React, { Component } from 'react';
// import PersonalEconomy from '../../../../build/contracts/PersonalEconomy.json';
// import classes from './Events.module.css';
// import { Row, Col, Tooltip } from 'reactstrap';

// const multiplier = 10 ** 18;

// class Events extends Component {
// state = {
//   eventsArray: [],
//   tooltipOpen: false
// };

// componentDidMount() {
//   // @DEV NOT SURE IF WE CAN GET EVENTS FROM DRIZZLE; WOULD BE BETTER NOT TO HAVE TO INSTANTIATE THE SAME CONTRACT
//   // WITH WEB3
//   const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

//   const web3Contract = new web3.eth.Contract(PersonalEconomy['abi'], this.props.address);
//   let eventsArray = [];
//   web3Contract.getPastEvents('allEvents', { fromBlock: 0, toBlock: 'latest' }, (err, events) => {
//     eventsArray.push(events);
//     this.setState({ eventsArray });
//     console.log(eventsArray);
//   });
// }

//   toggle = () => {
//     this.setState({
//       tooltipOpen: !this.state.tooltipOpen
//     });
//   };

//   render() {
//     const rows =
//       this.state.eventsArray[0] &&
//       this.state.eventsArray[0].map(event => {
//         return (
//           <tr key={event.transactionHash}>
//             <td>
//               {event.returnValues.time && new Date(event.returnValues.time * 1000).toDateString()}
//             </td>
//             <td>{event.event}</td>
//             <td>{event.returnValues.who && event.returnValues.who}</td>
//             <td>{event.returnValues.message ? event.returnValues.message : ''}</td>
//             <td>{event.returnValues.amount ? event.returnValues.amount / multiplier : ''}</td>
//             <td>{event.returnValues.totalCost ? event.returnValues.totalCost / multiplier : ''}</td>
//           </tr>
//         );
//       });

//     return (
//       <table className={classes.events}>
//         <tr>
//           <th className={classes.rowDate}> Date </th>
//           <th className={classes.rowEvent}> Event </th>
//           <th className={classes.rowAddress}> From </th>
//           <th className={classes.rowMessage}> Message </th>
//           <th className={classes.rowAmount}> Token Amount </th>
//           <th className={classes.rowAmount}> Ether Amount </th>
//         </tr>
//         <tr>
//           <td>{new Date(this.props.date * 1000).toDateString()}</td>
//           <td>Created</td>
//         </tr>

//         {rows}
//       </table>
//     );
//   }
// }

// export default Events;
