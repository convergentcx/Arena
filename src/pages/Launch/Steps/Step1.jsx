import React from 'react';
import classes from './Steps.module.css';
import { Typography, Button, CardContent } from '@material-ui/core';
import { Close } from '@material-ui/icons';

const step1 = props => (
  <div className={classes.StepBox}>
    <CardContent>
      <div className={classes.Header}>
        <Typography variant="h5" color="textPrimary">
          Step {props.currentStep} / {props.totalSteps}
        </Typography>
        <Close color="secondary" className={classes.CloseButton} onClick={props.cancel} />
        {/* Popover: This is free of cost, except transaction fees. 
        If you are not sure if this is for you, have a look at existing personal economies. */}
      </div>
      <Typography variant="h6" color="textPrimary">
        {' '}
        Let's do this.
      </Typography>
      <div className={classes.ExplainBox}>
        <Typography color="textPrimary">
          You are about to create an uncensorable, globally tradable, digital asset (aka token) in
          the economic ledger of humanity (aka the blockchain).
          <br />
          <br />
          This wizard will help you customize your token and endow it with the unique values you
          want it to represent.
        </Typography>
      </div>
      <div className={classes.FormBox} />
      <div className={classes.ButtonBar}>
        <Button fullWidth variant="contained" color="primary" onClick={props.nextStep}>
          Start
        </Button>
      </div>
    </CardContent>
  </div>
);

export default step1;
