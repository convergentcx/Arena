import React, { Component } from 'react';
import { Area, CartesianGrid, ComposedChart, ReferenceDot, Tooltip, XAxis, YAxis } from 'recharts';

import { getPrice, removeDecimals } from '../../util';
import { utils } from 'web3';

class ProfileChart extends Component {
  getChartData = () => {
    let { currentPrice, exponent, inverseSlope, totalSupply } = this.props.curveData;

    // poolBalance = utils.toBN(poolBalance);
    totalSupply = utils.toBN(totalSupply);

    const currentPoint = {
      x: parseFloat(removeDecimals(totalSupply.toString())).toFixed(4),
      y: parseFloat(removeDecimals(currentPrice.toString())).toFixed(4)
    };

    let data = [{ supply: 0, sell: 0, value: 0 }];

    const step = utils.toBN(10 ** 17);
    for (let i = step; i.lte(utils.toBN(750).mul(step)); i = i.add(step)) {
      const price = getPrice(inverseSlope, i, exponent);
      if (i.lte(totalSupply)) {
        data.push({
          supply: parseFloat(removeDecimals(i)).toFixed(4),
          sell: parseFloat(removeDecimals(price)).toFixed(4),
          value: parseFloat(removeDecimals(price)).toFixed(4)
        });
      } else if (i.gt(totalSupply)) {
        data.push({
          supply: parseFloat(removeDecimals(i)).toFixed(4),
          buy: parseFloat(removeDecimals(price)).toFixed(4),
          value: parseFloat(removeDecimals(price)).toFixed(4)
        });
      }
    }

    return {
      data,
      currentPoint
    };
  };

  render() {
    let { data, currentPoint } = this.getChartData();

    return (
      <div>
        <ComposedChart
          style={{ margin: 'auto' }}
          width={this.props.width}
          height={this.props.height}
          data={data}
          margin={this.props.margin}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="supply" type={'number'} />
          <YAxis dataKey="value" type={'number'} />
          <Tooltip />

          <Area
            isAnimationActive={false}
            dots={false}
            stackOffset={'none'}
            dataKey="value"
            name={'price'}
            key={'price'}
            stroke="#0095b3"
            fill="none"
          />

          <Area
            isAnimationActive={false}
            stackOffset={'none'}
            dataKey="sell"
            stroke="#0095b3"
            fill="#0095b3"
          />

          <ReferenceDot
            isFront={true}
            ifOverflow="extendDomain"
            x={currentPoint.x}
            y={currentPoint.y}
            r={16}
            // fill="blue"
            stroke="#0095b3"
            label={currentPoint.y}
          />
        </ComposedChart>
      </div>
    );
  }
}

export default ProfileChart;
