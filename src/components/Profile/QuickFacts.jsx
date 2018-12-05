/* QuickFacts shows:

  XXX
  Contributors

  XXX
  Market Cap

  [WATCH]  [SHARE]
  (S) (S) (S)
*/

import React, { Component } from 'react';

import { Button, IconButton, Paper, Typography } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

class SocialBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const items = Object.keys(this.props.socials).map((key) => {
      const destination = this.props.socials[key];
      return (
        <IconButton color="secondary" onClick={() => window.open(destination)}>
          <Delete />
        </IconButton>
      );
    });
    return <div>{items}</div>
  }
}

const QuickFacts = props => (
  <Paper style={{ padding: '12px', width: props.width || '350px' }}>
    <Typography variant="h5" style={{ fontWeight: 'bold', color: '#052D49'}}>
      {props.contributors}
    </Typography>
    <Typography variant="subtitle1" style={{ color: '#4F687A', fontSize: '12px', fontWeight: 'bold' }}>
      contributors
    </Typography>
    <Typography variant="h5" style={{ fontWeight: 'bold', color: '#052D49'}}>
      {props.marketCap} ETH
    </Typography>
    <Typography variant="subtitle1" style={{ color: '#4F687A', fontSize: '12px', fontWeight: 'bold' }}>
      market cap
    </Typography>
    <div>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => window.open('https://convergent.cx')}
      >
        WATCH
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => window.open('https://convergent.cx')}
      >
        SHARE
      </Button>
    </div>
    <div>
      <SocialBar socials={props.socials || {}} />
    </div>
  </Paper>
);

export default QuickFacts;
