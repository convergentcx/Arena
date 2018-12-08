import React, { Component } from 'react';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';

import { removeDecimals } from '../../../../../util';

class Stats extends Component {
  render() {
    const yourBalance = this.props.yourBalance;
    const currentPrice = this.props.currentPrice;
    const totalSupply = this.props.totalSupply;

    return (
      <Grid
        item
        xs={12}
        md={6}
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center' }}
      >
        <Grid item xs={12} style={{ paddingBottom: '6px', height: '50%' }}>
          <Card style={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Your Balance
              </Typography>
              <Typography variant="h2" component="h2">
                {removeDecimals(yourBalance)} {this.props.symbol}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Current Value: {removeDecimals(yourBalance) * removeDecimals(currentPrice) * 100} $
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} style={{ paddingTop: '6px', height: '50%' }}>
          <Card style={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Market Cap
              </Typography>
              <Typography variant="h2" component="h2">
                {removeDecimals(currentPrice) * removeDecimals(totalSupply)} Ξ
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Current Value: {removeDecimals(currentPrice) * removeDecimals(totalSupply) * 100} $
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default Stats;
