/// Development Testing Page

import React from 'react';

import { Grid } from '@material-ui/core';

import InfoCard from './components/Profile/QuickFacts.jsx';
import ServiceBar from './components/Profile/SideServiceBar.jsx';

const Dev = () => (
  <div style={{ padding: '8%' }}>
    <Grid container>
      <Grid item xs={3}>
        <InfoCard
          contributors={6}
          marketCap={12000}
          socials={ { twitter: 'https://convergent.cx', facebook: 'https://convergent.cx', instagram: 'https://convergent.cx' } }
          width="100%"
        />
      </Grid>
      <Grid item xs={6} />
      <Grid item xs={3}>
        <ServiceBar
          symbol="LGN"
          dataJson={{services:[{service: '123'}]}} />      
      </Grid>
    </Grid>
  </div>
);

export default Dev;
