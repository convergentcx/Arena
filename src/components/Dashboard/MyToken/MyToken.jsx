import React, { Component } from 'react';
import { Card, CardHeader, Button, CardBody, Row, Col } from 'reactstrap';
import classes from './MyToken.module.css';
import withContext from '../../../hoc/withContext';
import { withRouter } from 'react-router-dom';

import Events from './Events/Events';
import PersonalEconomy from '../../../build/contracts/PersonalEconomy.json';
// import ContractInfo from '../../ListToken/TokenDetails/ContractInfo/ContractInfo';
// import BuySell from '../ListToken/TokenDetails/BuySell/BuySell';
// import RequestService from '../ListToken/TokenDetails/RequestService/RequestService';
// import CurveChart from '../ListToken/TokenDetails/Chart/Chart';

// import classes from '../ListToken/TokenDetails/TokenDetails.module.css';


import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Money from '@material-ui/icons/AttachMoney';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

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
    const { classes } = this.props;

    // const rows = this.state.eventsArray && this.state.eventsArray.map(tokenEvents => (
    //     <table>
    //         {tokenEvents.map(event => (
    //             <tr>
    //                 <td>{event.event}</td>
    //                 <td>{event.returnValues && (new Date(event.returnValues.time * 1000)).toDateString()}</td>
    //                 <td>{event.returnValues && event.returnValues.message}</td>
    //                 <td>{event.returnValues && event.returnValues.price}</td>
    //             </tr>))}
    //     </table>

    // ))

    // const rows = this.state.eventsArray.map(event => {
    //     console.log(event.returnValues && event.returnValues.time)
    // })

    return (
      <div id={this.props.address} className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
  <Paper className={classes.paper} style={{fontWeight: 'bold', textAlign: 'left'}}>{this.props.name}
                <div className={classes.DetailsButton}>
                <Button color="secondary" size="sm" onClick={this.showDetails} style={{float: 'right'}}>
                  Details
            </Button>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>
            <Money />
            <h4>Some stats</h4>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>
            <Money />
            <h4>Market cap</h4>            
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>
            <Money />
            <h4>Current Price</h4>    
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>
            <Money />
            <h4>Reserve</h4>                
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>Some graphic (xs=12 sm=6)</Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>Some graphic (xs=12 sm=6)</Paper>
          </Grid>
          <Grid item xs={12}>
            <Events date={this.props.date} address={this.props.address} />
          </Grid>


        </Grid>

      </div>
    );
  }
}

export default withStyles(styles)(withContext(withRouter(MyTokens)));
