import React from 'react';
import { Table } from 'reactstrap';

const Leaderboard = () => (
  <div style={{ marginLeft: '200px', marginRight: '200px' }}>
    <Table borderless hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Market Cap</th>
          <th>24hr Change</th>
          <th>7 Day Change</th>
        </tr>
      </thead>
      <tbody>{/* TODO */}</tbody>
    </Table>
  </div>
);

export default Leaderboard;
