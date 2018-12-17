import React, { Component } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { withTheme } from '@material-ui/core/styles';

import { getPrice, removeDecimals } from '../../util';
import { utils } from 'web3';

class ProfileChart extends Component {
  getChartData = () => {
    let { currentPrice, exponent, inverseSlope, totalSupply } = this.props.curveData;

    totalSupply = utils.toBN(totalSupply);

    const currentPoint = {
      x: parseFloat(removeDecimals(totalSupply.toString())).toFixed(4),
      y: parseFloat(removeDecimals(currentPrice.toString())).toFixed(4),
    };

    let data = [{ supply: 0, sell: 0, value: 0 }];

    const step = utils.toBN(10 ** 17);
    for (let i = step; i.lte(utils.toBN(750).mul(step)); i = i.add(step)) {
      const price = getPrice(inverseSlope, i, exponent);
      if (i.lte(totalSupply)) {
        data.push({
          supply: parseFloat(removeDecimals(i)).toFixed(4),
          sell: parseFloat(removeDecimals(price)).toFixed(4),
          value: parseFloat(removeDecimals(price)).toFixed(4),
        });
      } else if (i.gt(totalSupply)) {
        data.push({
          supply: parseFloat(removeDecimals(i)).toFixed(4),
          buy: parseFloat(removeDecimals(price)).toFixed(4),
          value: parseFloat(removeDecimals(price)).toFixed(4),
        });
      }
    }

    return {
      data,
      currentPoint,
    };
  };

  render() {
    let { data, currentPoint } = this.getChartData();
    const { height, width } = this.props;

    return (
      <ResponsiveContainer height={height} width={width}>
        <AreaChart style={{ margin: 'auto' }} data={data} margin={this.props.margin}>
          <CartesianGrid strokeDasharray="2 2" stroke={this.props.theme.palette.secondary.main} />
          <XAxis
            dataKey="supply"
            type="number"
            stroke={this.props.theme.palette.secondary.main}
            fill={this.props.theme.palette.secondary.main}
          />
          <YAxis
            dataKey="value"
            type="number"
            stroke={this.props.theme.palette.secondary.main}
            fill={this.props.theme.palette.secondary.main}
          />
          <Tooltip />

          <Area
            isAnimationActive={false}
            dots={false}
            stackOffset={'none'}
            dataKey="value"
            name={'price'}
            key={'price'}
            stroke={this.props.theme.palette.secondary.main}
            fill="none"
          />

          <Area
            isAnimationActive={false}
            stackOffset={'none'}
            dataKey="sell"
            stroke={this.props.theme.palette.secondary.main}
            fill={this.props.theme.palette.secondary.main}
          />

          <ReferenceDot
            x={currentPoint.x}
            y={currentPoint.y}
            r={4}
            stroke={this.props.theme.palette.secondary.main}
            fill={this.props.theme.palette.secondary.main}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}

export default withTheme()(ProfileChart);
