import React, { Component } from 'react';
import { Table } from 'reactstrap';

import withContext from '../../hoc/withContext';

class LeaderboardList extends Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    console.log(this.props);
    const { PersonalEconomyFactory } = this.props.drizzle.contracts;

    PersonalEconomyFactory.events.Created({
      fromBlock: 0,
    }).on('data', (event) => {
      console.log(event);
    })
  }

  render() {
    return (
      <tbody>
        <tr>
          <td>Hello World</td>
          <td>Hello World</td>
          <td>Hello World</td>
          <td>Hello World</td>
        </tr>
      </tbody>
    );
  }
}

const LeaderboardListContextualized = withContext(LeaderboardList);

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
      <LeaderboardListContextualized />
    </Table>
  </div>
);

export default Leaderboard;
