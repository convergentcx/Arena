/* OwnerCard shows:

  XXX
  you own

  XXX
  worth in ETH or $

*/

import React from "react";
import { removeDecimals } from "../../util";

import { Paper, Typography } from "@material-ui/core";

const OwnerCard = props => (
  <Paper style={{ padding: "12px", marginBottom: "16px" }}>
    <Typography
      variant="subtitle1"
      style={{ color: "primary", fontSize: "12px", fontWeight: "bold" }}
    >
      you own
    </Typography>
    <Typography variant="h5" style={{ fontWeight: "bold", color: "primary" }}>
      {removeDecimals(props.tokenBalance)} {props.symbol}
    </Typography>
  </Paper>
);

export default OwnerCard;
