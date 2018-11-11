import React from 'react';
const Recharts = require('recharts');

const {
  Area,
  // Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // Legend,
  ReferenceDot,
  ComposedChart,
  Label
} = Recharts;

class CurveChart extends React.Component {
  
  getChartData() {
    let { totalSupply, poolBalance, invSlope, exponent, currentPrice } = this.props.curveData;
    poolBalance = parseFloat(poolBalance) || 0;
    totalSupply = parseFloat(totalSupply) || 0;

    let currentPoint = { supply: totalSupply, value: currentPrice };

    let data = [];
    let step = (totalSupply || 50) / 100;


    for (let i = step; i < (totalSupply || 50) * 1.5; i += step) {
      let price = 1 / invSlope * (i ** exponent);
      if (i < totalSupply) {
        data.push({ supply: i, sell: price.toFixed(4), value: parseFloat(price.toFixed(4)) });
      } else if (i >= totalSupply) {
        data.push({ supply: i, buy: price.toFixed(4), value: parseFloat(price.toFixed(4)) });
      }
    }
    return { data, currentPoint };
  }

  render () {
    let { data, currentPoint } = this.getChartData();

    return (
      <div >

        <ComposedChart
          style={{ margin: 'auto' }}
          width={this.props.width}
          height={this.props.height}
          data={data}
          margin={this.props.margin}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="supply" type={'number'}>
          <Label value="Token Supply" position = "insideBottomRight" dy={20}/>
          </XAxis>
          <YAxis dataKey="value" type={'number'}>
          <Label value="Token Price" position="insideTopLeft" style={{ textAnchor: 'right' }} angle={270} dy={100} offset={-20} />
          </YAxis>
          <Tooltip/>

          <Area isAnimationActive={false} dots={false} stackOffset={'none'} dataKey="value" name={'price'} key={'price'} stroke='#0095b3' fill='none'/>

          <Area isAnimationActive={false} stackOffset={'none'} dataKey="sell" stroke="#0095b3" fill='#0095b3' />

          <ReferenceDot
            isFront={true}
            ifOverflow="extendDomain"
            x={currentPoint.supply}
            y={currentPoint.value}
            r={16}
            // fill="blue"
            stroke="#0095b3"
            label={currentPoint.value.toFixed(2)}
          />

        </ComposedChart>


      </div>
    )
  }
}

export default CurveChart;