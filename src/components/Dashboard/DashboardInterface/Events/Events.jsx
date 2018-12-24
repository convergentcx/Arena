import Web3 from 'web3';
import PersonalEconomy from '../../../../build/contracts/PersonalEconomy.json';

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

import { removeDecimals } from '../../../../util';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class Events extends React.Component {
  state = {
    eventsArray: [],
    tooltipOpen: false,
  };

  componentDidMount() {
    const web3 = new Web3(this.props.drizzle.web3.currentProvider);

    const web3Contract = new web3.eth.Contract(PersonalEconomy['abi'], this.props.address);
    let eventsArray = [];
    web3Contract.getPastEvents('allEvents', { fromBlock: 0, toBlock: 'latest' }, (_, events) => {
      eventsArray.push(events);
      this.setState({ eventsArray });
    });
  }

  render() {
    const { classes } = this.props;
    const rows =
      this.state.eventsArray[0] &&
      this.state.eventsArray[0].map((row, index) => {
        return (
          <TableRow key={index}>
            <TableCell component="th" scope="row">
              {row.event}
            </TableCell>
            <TableCell>
              {row.returnValues.time && new Date(row.returnValues.time * 1000).toDateString()}
            </TableCell>
            <TableCell>{row.returnValues.who && row.returnValues.who}</TableCell>
            <TableCell>{row.returnValues.message ? row.returnValues.message : ''}</TableCell>
            <TableCell>
              {row.returnValues.amount ? removeDecimals(row.returnValues.amount) : ''}
            </TableCell>
            <TableCell>
              {row.returnValues.totalCost ? removeDecimals(row.returnValues.totalCost) : ''}
            </TableCell>
          </TableRow>
        );
      });

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
