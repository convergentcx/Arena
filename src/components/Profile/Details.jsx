import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
} from '@material-ui/core';

import Hannah from '../../assets/hannah.jpg';

const Details = props => (
  <div>
    <Grid container>
      <Grid item md={6}>
        <Card style={{ margin: '6px' }}>
          <CardHeader>Market Cap</CardHeader>
          <CardContent>{props.marketCap} ETH</CardContent>
        </Card>
      </Grid>
      <Grid item md={6}>
        <Card style={{ margin: '6px' }}>
          <CardHeader>You own</CardHeader>
          <CardContent>
            {props.tokenBalance} {props.symbol}
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    {/* <Grid container style={{ paddingTop: '2%' }}>
      <Grid item md={12}>
        <Card style={{ margin: '6px' }}>
          <CardMedia
              alt="person's photo"
              image={Hannah}
              style={{ height: '0', paddingTop: '56.25%' }}
            />
          <CardHeader title="About Hannah" />
          <CardContent>
            Hi I am Hanna - I like to get paid when someone wants something from me..
          </CardContent>
        </Card>
      </Grid>
    </Grid> */}
  </div>
);

export default Details;
