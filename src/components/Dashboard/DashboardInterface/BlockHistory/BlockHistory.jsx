import React, { Component } from 'react';
import PriceChart from '../PriceChart/PriceChart';

class BlockHistory extends Component {
  state = {
    timestamps: {},
    sort: []
  };

  handleBlockLoad(block, event) {
    if (block) {
      this.setState({
        timestamps: {
          ...this.state.timestamps,
          [event.blockHash]: parseInt(block.timestamp, 10)
        }
      });
    }
  }

  render() {
    const { contract, symbol, showChart, currentPrice } = this.props;
    const { timestamps } = this.state;
    const sortedEvents = contract.events
      .map(event => [event, timestamps[event.blockHash] || Infinity])
      .sort((a, b) => a[1] - b[1]);
    return (
      <div className="blockHistory">
        {showChart && (
          <PriceChart events={sortedEvents} symbol={symbol} currentPrice={currentPrice} />
        )}
      </div>
    );
  }
}

export default BlockHistory;
