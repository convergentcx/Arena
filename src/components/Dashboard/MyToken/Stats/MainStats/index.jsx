import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const multiplier = 10 ** 18;

class Stats extends React.Component {
  render() {
    const yourBalance = this.props.yourBalance;
    const currentPrice = this.props.currentPrice;
    const totalSupply = this.props.totalSupply;

    return (
      <Grid
        item
        md={3}
        xs={12}
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        <Grid item md={12} style={{ paddingBottom: '6px', height: '50%' }}>
          <Card style={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Your Balance
              </Typography>
              <Typography variant="h2" component="h2">
                {yourBalance / multiplier.toFixed(3)} {this.props.symbol}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Current Value: {(yourBalance / multiplier.toFixed(3)) * currentPrice * 500} $
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item md={12} style={{ paddingTop: '6px', height: '50%' }}>
          <Card style={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Market Cap
              </Typography>
              <Typography variant="h2" component="h2">
                {currentPrice * (totalSupply / multiplier)} Ξ
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Current Value: {currentPrice * (totalSupply / multiplier) * 500} $
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default Stats;
