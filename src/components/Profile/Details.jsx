import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
} from '@material-ui/core';

const Details = props => (
  <div>
    <Grid container>
      <Grid item md={6}>
        <Card>
          <CardHeader>Market Cap</CardHeader>
          <CardContent>{props.marketCap} ETH</CardContent>
        </Card>
      </Grid>
      <Grid item md={6}>
        <Card>
          <CardHeader>You own</CardHeader>
          <CardContent>
            {props.tokenBalance} {props.symbol}
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    <Grid container style={{ paddingTop: '2%' }}>
      <Grid item md={12}>
        <Card>
          <CardHeader>About {props.name}</CardHeader>
          <CardContent>
            Hi I am Hanna - I like to get paid when someone wants something from me..
          </CardContent>
          <CardMedia
            height="200px"
            src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=100"
            alt="Card image cap"
          />
        </Card>
      </Grid>
    </Grid>
  </div>
);

export default Details;
