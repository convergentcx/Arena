import React from 'react';
import AttributeInput from '../AttributeInput';
import { Button, CardContent, Grid, TextField, Typography } from '@material-ui/core';
import classes from './Steps.module.css';
import { Close } from '@material-ui/icons';
import { HelpOutline } from '@material-ui/icons';
import HelpTooltip from './HelpTooltip';

const step3 = props => (
  <div className={classes.StepBox}>
    <CardContent>
      <div className={classes.Header}>
        <Typography variant="h5" color="textPrimary">
          Step {props.currentStep} / {props.totalSteps}
        </Typography>
        <Close color="secondary" className={classes.CloseButton} onClick={props.cancel} />
        <HelpTooltip
          text="This is your chance to explain to the market why your token will be valuable.
          Tell people about the part of yourself or of your work that you want to tokenize, 
          and explain why they can trust that you will honor your token."
        >
          <HelpOutline color="secondary" className={classes.HelpButton} />
        </HelpTooltip>
      </div>
      <Typography variant="h6" color="textPrimary">
        Details
      </Typography>
      <div className={classes.ExplainBox}>
        <Typography color="textPrimary">
          Describe the part of yourself that you are planning to tokenize.
        </Typography>
      </div>
      <div className={classes.FormBox}>
        <Grid container>
          <Grid item xs={12} style={{ marginTop: '2vh' }}>
            <TextField
              multiline
              rows="3"
              rowsMax="3"
              label="Description"
              type="text"
              name="description"
              value={props.description}
              onChange={props.inputUpdate}
              style={{ width: '100%' }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '2vh' }}>
            <AttributeInput passItems={props.getSelectedTags} />
          </Grid>
        </Grid>
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
