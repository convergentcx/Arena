/* OwnerCard shows:

  XXX
  you own

  XXX
  worth in ETH or $

*/

import React from 'react';
import { removeDecimals } from '../../util';

import { Paper, Typography } from '@material-ui/core';

const OwnerCard = props => (
  <div style={{ padding: '12px' }}>
    <Typography
      variant="subtitle1"
      color="primary.main"
      style={{ fontSize: '12px', fontWeight: 'bold' }}
    >
      you own
    </Typography>
    <Typography variant="h5" color="secondary" style={{ fontWeight: 'bold' }}>
      {removeDecimals(props.tokenBalance)} {props.symbol}
    </Typography>
  </div>
);

export default OwnerCard;
