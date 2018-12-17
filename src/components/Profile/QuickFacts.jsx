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
import { PublicTwoTone } from '@material-ui/icons';

const comingSoon = () => alert('Coming soon! 🌈');

class SocialBar extends Component {
  render() {
    const items = Object.keys(this.props.socials).map((key, index) => {
      // TODO: destination will be external links. Not sure where exactly they should go to yet tho.
      // const destination = this.props.socials[key];
      return (
        <IconButton key={index} color="secondary" onClick={comingSoon}>
          <PublicTwoTone />
        </IconButton>
      );
    });
    return <div>{items}</div>;
  }
}

const QuickFacts = props => (
  <Paper style={{ padding: '12px', width: props.width || '350px' }}>
    <Typography
      variant="subtitle1"
      style={{ color: 'primary', fontSize: '12px', fontWeight: 'bold' }}
    >
      contributors
    </Typography>
    <Typography variant="h5" style={{ fontWeight: 'bold', color: 'primary' }}>
      {props.contributors}
    </Typography>
    <Typography
      variant="subtitle1"
      style={{ color: 'primary', fontSize: '12px', fontWeight: 'bold' }}
    >
      market cap
    </Typography>
    <Typography variant="h5" style={{ fontWeight: 'bold', color: 'primary' }}>
      {props.marketCap} ETH
    </Typography>
    <div style={{ marginTop: '12px' }}>
      <Button variant="outlined" color="secondary" onClick={comingSoon}>
        WATCH
      </Button>
      &nbsp;&nbsp;
      <Button variant="outlined" color="secondary" onClick={comingSoon}>
        SHARE
      </Button>
    </div>
    <div style={{ marginTop: '12px' }}>
      <SocialBar socials={props.socials || {}} />
    </div>
  </Paper>
);

export default QuickFacts;
