import React, { Component } from "react";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";

import classes from "./SmallStats.modules.css";

import { removeDecimals } from "../../../../../util";

class Stats extends Component {
  render() {
    const currentPrice = this.props.currentPrice;
    const totalSupply = this.props.totalSupply;

    return (
      <Grid item xs={12} md={6} style={{ textAlign: "center" }}>
        <Grid container style={{ height: "100%" }}>
          <Grid
            item
            xs={12}
            style={{ height: "50%", display: "flex", paddingBottom: "6px" }}
          >
            <Card
              className={classes.smallCard}
              style={{
                margin: "0",
                marginRight: "6px",
                width: "95%",
                boxSizing: "border-box"
              }}
            >
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Current Price
                </Typography>
                <Typography variant="h6" component="h2">
                  {removeDecimals(currentPrice)} Ξ
                </Typography>
              </CardContent>
            </Card>

            {/* 2 */}
            <Card
              className={classes.smallCard}
              style={{
                margin: "0",
                marginLeft: "6px",
                width: "95%",
                boxSizing: "border-box"
              }}
            >
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Current Token Supply
                </Typography>
                <Typography variant="h6" component="h2">
                  {removeDecimals(totalSupply) + " " + this.props.symbol}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            sm={12}
            style={{ height: "50%", display: "flex", paddingTop: "6px" }}
          >
            <Card
              className={classes.smallCard}
              style={{
                margin: "0",
                marginRight: "6px",
                width: "95%",
                boxSizing: "border-box"
              }}
            >
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Reserve Pool
                </Typography>
                <Typography variant="h6" component="h2">
                  {removeDecimals(this.props.poolBalance)} Ξ
                </Typography>
              </CardContent>
            </Card>

            <Card
              className={classes.smallCard}
              style={{
                margin: "0",
                marginLeft: "6px",
                width: "95%",
                boxSizing: "border-box"
              }}
            >
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Price formula
                </Typography>
                <Typography variant="h6" component="h2">
                  {`p = 1 / ${this.props.inverseSlope} * supply ^ ${
                    this.props.exponent
                  }`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Stats;
