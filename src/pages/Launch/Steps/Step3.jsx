import React from 'react';
import AttributeInput from '../AttributeInput';
import { Button, CardContent, Grid, TextField, Typography } from '@material-ui/core';
import classes from './Steps.module.css';
import { Close } from '@material-ui/icons';
import { HelpOutline } from '@material-ui/icons';

const step3 = props => (
  <div className={classes.StepBox}>
    <CardContent>
      <div className={classes.Header}>
        <Typography variant="h5" color="primary.main">
          Step {props.currentStep} / {props.totalSteps}
        </Typography>
        <Close color="secondary" className={classes.CloseButton} onClick={props.cancel} />
        <HelpOutline color="secondary" className={classes.HelpButton} />
      </div>
      <Typography variant="h6" color="primary.main">
        Purpose.
      </Typography>
      <div className={classes.ExplainBox}>
        <Typography color="primary.main">
          Describe your economic identity and the intended purpose of your token.
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
