import React from 'react';
import { Button, CardContent, Grid, TextField, Typography } from '@material-ui/core';
import classes from './Steps.module.css';
import { Close } from '@material-ui/icons';
import { HelpOutline } from '@material-ui/icons';
import HelpTooltip from './HelpTooltip';

const step3 = props => (
  <div className={classes.StepBox}>
    <CardContent>
      <div className={classes.Header}>
        <Typography variant="h5" color="primary.main">
          Step {props.currentStep} / {props.totalSteps}
        </Typography>
        <Close color="secondary" className={classes.CloseButton} onClick={props.cancel} />
        <HelpTooltip
          text="
          Your art, your craft, your time, your expertise, your influence, your care and attention ... there are 
          countless things that only you can offer. Many of these things are currently not on the market,
          because they are not yet valued! Here is your chance to offer future versions of these goods and services."
        >
          <HelpOutline color="secondary" className={classes.HelpButton} />
        </HelpTooltip>{' '}
      </div>
      <Typography variant="h6" color="primary.main">
        Services.
      </Typography>
      <div className={classes.ExplainBox}>
        <Typography color="primary.main">
          Tell the market what real-world values can be purchased with this token. What is backing
          your personal cryptocurrency?
        </Typography>
      </div>
      <div className={classes.FormBox}>
        <Grid container>
          <Grid item md={10}>
            <TextField
              label="Service"
              type="text"
              name="service-0"
              placeholder={`What value will I provide in exchange for 1 ${
                props.symbol ? props.symbol : 'of my personal tokens'
              }?`}
              onChange={props.inputUpdate}
              fullWidth
            />
          </Grid>

          <Grid item md={2}>
            <TextField
              label={`Price (${props.symbol})`}
              type="text"
              name="price-0"
              value={props.price0}
              onChange={props.inputUpdate}
              style={{ marginLeft: '30px' }}
            />
          </Grid>
        </Grid>
        {props.moreServices}
        <div className={classes.AddRemoveButtons}>
          <Button size="small" variant="outlined" onClick={props.addService}>
            Add more services
          </Button>
          <Button size="small" variant="outlined" onClick={props.removeService}>
            Remove service
          </Button>
        </div>
        {/* Alerts */}
        {props.tooMany && (
          <div color="warning" className={classes.AddRemoveWarnings}>
            <Typography>
              While we build{' '}
              <span role="img" aria-label="emoji">
                🛠
              </span>{' '}
              only 3 services will be available in your economy{' '}
              <span role="img" aria-label="emoji">
                💸
              </span>
            </Typography>
          </div>
        )}
        {props.tooFew && (
          <div color="warning" className={classes.AddRemoveWarnings}>
            <Typography>
              For your economy to work{' '}
              <span role="img" aria-label="emoji">
                👨‍💼
              </span>{' '}
              you need to offer at least one service{' '}
              <span role="img" aria-label="emoji">
                🗳
              </span>
            </Typography>
          </div>
        )}
      </div>
      <div className={classes.ButtonBar}>
        <div className={classes.BackButton}>
          <Button variant="outlined" color="secondary" onClick={props.previousStep}>
            Back
          </Button>
        </div>
        <div className={classes.ForwardButtons}>
          <Button
            variant="outlined"
            color="primary"
            onClick={props.nextStep}
            className={classes.SkipButton}
          >
            Skip
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={props.nextStep}
            className={classes.NextButton}
            style={{ marginLeft: '20px' }}
          >
            Next
          </Button>
        </div>
      </div>
    </CardContent>
  </div>
);

export default step3;
