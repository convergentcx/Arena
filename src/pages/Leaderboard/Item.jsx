import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Chip, Grid, Paper, Typography } from '@material-ui/core';

import makeBlockie from 'ethereum-blockies-base64';
import { removeDecimals } from '../../util';

const Item = props => (
  <Paper
    elevation={6}
    style={{ borderRadius: '50%', height: '', background: '#FFF', marginBottom: '10px' }}
  >
    <Grid container style={{ background: '', padding: '8px' }}>
      <Grid
        item
        xs={3}
        style={{
          background: '',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        <div />
        <img
          src={makeBlockie(props.address)}
          alt="blockie"
          style={{ borderRadius: '50%', width: '50px', height: '50px' }}
        />
      </Grid>

      <Grid item xs={6}>
        <Grid container>
          <Grid
            item
            xs={12}
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Typography style={{ marginTop: '2%' }}>{props.name}</Typography>
            <Typography style={{ marginTop: '2%' }}>
              {removeDecimals(removeDecimals(props.marketCap))} ETH
            </Typography>
            <Typography style={{ marginTop: '2%' }}>{props.twentyFour}</Typography>
            <Typography style={{ marginTop: '2%' }}>{props.sevenDay}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Chip label="Blockchain" color="" variant="outlined" style={{ marginRight: '4px' }} />
            <Chip label="Literature" color="" variant="outlined" style={{ marginRight: '4px' }} />
            <Chip label="Design" color="" variant="outlined" style={{ marginRight: '4px' }} />
            <Chip label="Anarchy" color="" variant="outlined" style={{ marginRight: '4px' }} />
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        xs={3}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        <Link to={`tokens/${props.address}`}>
          <Button color="" variant="contained">
            DISCOVER
          </Button>
        </Link>
        <div />
      </Grid>
    </Grid>
  </Paper>
);

export default Item;
