import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  Grid,
} from '@material-ui/core';

import { removeDecimals } from '../../util';

const Details = props => (
  <div>
    <Grid container>
      <Grid item md={6}>
        <Card style={{ margin: '6px' }}>
          <CardHeader title="Market Cap" />
          <CardContent>{removeDecimals(removeDecimals(props.marketCap))} ETH</CardContent>
        </Card>
      </Grid>
      <Grid item md={6}>
        <Card style={{ margin: '6px' }}>
          <CardHeader title="You own" />
          <CardContent>
            {props.tokenBalance} {props.symbol}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </div>
);

export default Details;
