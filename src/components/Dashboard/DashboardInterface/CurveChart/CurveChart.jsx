import React, { Component } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ReferenceDot,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

class CurveChart extends Component {
  getChartData() {
    let {
      totalSupply,
      inverseSlope,
      exponent,
      currentPrice
    } = this.props.curveData;
    // poolBalance = parseFloat(poolBalance) || 0;
    totalSupply = parseFloat(totalSupply) || 0;

    let currentPoint = { supply: totalSupply, value: currentPrice };

    let data = [];
    let step = (totalSupply || 50) / 100;

    for (let i = step; i < (totalSupply || 50) * 1.5; i += step) {
      let price = (1 / inverseSlope) * i ** exponent;
      if (i < totalSupply) {
        data.push({
          supply: i,
          sell: price.toFixed(4),
          value: parseFloat(price.toFixed(4))
        });
      } else if (i >= totalSupply) {
        data.push({
          supply: i,
          buy: price.toFixed(4),
          value: parseFloat(price.toFixed(4))
        });
      }
    }
    return { data, currentPoint };
  }

  render() {
    let { data, currentPoint } = this.getChartData();

    return (
      <div>
        <ComposedChart
          style={{ margin: "auto" }}
          width={this.props.width}
          height={this.props.height}
          data={data}
          margin={this.props.margin}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="supply" type={"number"} />
          <YAxis dataKey="value" type={"number"} />
          <Tooltip />

          <Area
            isAnimationActive={false}
            dots={false}
            stackOffset={"none"}
            dataKey="value"
            name={"price"}
            key={"price"}
            stroke="black"
            fill="none"
          />

          <Area
            isAnimationActive={false}
            stackOffset={"none"}
            dataKey="sell"
            stroke="black"
            fill="black"
          />

          <ReferenceDot
            isFront={true}
            ifOverflow="extendDomain"
            x={currentPoint.supply}
            y={currentPoint.value}
            r={16}
            // fill="blue"
            stroke="black"
            label={currentPoint.value.toFixed(2)}
          />
        </ComposedChart>
      </div>
    );
  }
}

export default CurveChart;
