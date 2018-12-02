import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import classes from './SmallStats.modules.css'

const multiplier = 10 ** 18;


class Stats extends React.Component {


  render() {
    const currentPrice = this.props.currentPrice;
    const totalSupply = this.props.totalSupply;

    return (

      <Grid item md={5} xs={12}>

        <Grid container style={{ height: '100%' }}>
          <Grid item sm={12} style={{ height: '50%', display: 'flex', 'paddingBottom': '6px' }}>
            <Card className={classes.smallCard} style={{ margin: '0', marginRight: '6px', width: '95%', boxSizing: 'border-box' }} >
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Current Price
                    </Typography>
                <Typography variant="h6" component="h2">
                  {currentPrice} Ξ
                    </Typography>
              </CardContent>
            </Card>

            {/* 2 */}
            <Card className={classes.smallCard} style={{ margin: '0', 'marginLeft': '6px', width: '95%', boxSizing: 'border-box' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Current Token Supply
                    </Typography>
                <Typography variant="h6" component="h2">
                  {totalSupply / multiplier} {this.props.symbol}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={12} style={{ height: '50%', display: 'flex', 'paddingTop': '6px' }}>
            <Card className={classes.smallCard} style={{ margin: '0', 'marginRight': '6px', width: '95%', boxSizing: 'border-box'  }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Reserve Pool
                    </Typography>
                <Typography variant="h6" component="h2">
                  {this.props.poolBalance / multiplier} Ξ
                    </Typography>
              </CardContent>
            </Card>

            <Card className={classes.smallCard} style={{ margin: '0', 'marginLeft': '6px', width: '95%', boxSizing: 'border-box'  }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Price formula
                    </Typography>
                <Typography variant="h6" component="h2">
                  {`p = 1 / ${this.props.inverseSlope} * supply ^ ${this.props.exponent}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Grid>

    )
  }
}

export default Stats;