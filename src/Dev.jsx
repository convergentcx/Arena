/// Development Testing Page

import React from 'react';

import InfoCard from './components/Profile/QuickFacts.jsx';

const Dev = () => (
  <div style={{ padding: '8%' }}>
    <InfoCard
      contributors={6}
      marketCap={12000}
      socials={ { twitter: 'https://convergent.cx', facebook: 'https://convergent.cx', instagram: 'https://convergent.cx' } }
    />
  </div>
);

export default Dev;
