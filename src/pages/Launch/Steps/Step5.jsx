import React from 'react';
import { Button, CardContent, Grid, LinearProgress, Typography } from '@material-ui/core';
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
        Review
      </Typography>
      <div className={classes.ExplainBox}>
        <Typography color="primary.main">
          Quick check and deploy{' '}
          <span role="img" aria-label="emoji">
            🚀
          </span>
          . You can edit everything later, except for the token name and the token symbol.
        </Typography>
      </div>
      <div className={classes.FormBox}>
        <Grid container>
          <Grid item xs={8} style={{ marginTop: '2vh' }}>
            Name: {props.name}
          </Grid>
          <Grid item xs={4} style={{ marginTop: '2vh' }}>
            Symbol: {props.symbol}
          </Grid>
          <Grid item xs={12} style={{ marginTop: '2vh' }}>
            Description: {props.description}
          </Grid>
          <Grid item xs={12} style={{ marginTop: '2vh' }}>
            Tags: {props.tags}
          </Grid>
          <Grid item xs={12} style={{ marginTop: '2vh' }}>
            Services: {props.tags}
          </Grid>
        </Grid>
      </div>
      <Grid item md={12} style={{ marginTop: '2vh' }}>
        {props.ipfsUploading && (
          <div style={{ width: '100%' }}>
            <LinearProgress color="secondary" />
            Uploading to IPFS!{' '}
            <span role="img" aria-label="emoji">
              📡
            </span>
          </div>
        )}
      </Grid>
      <div className={classes.ButtonBar}>
        <div className={classes.BackButton}>
          <Button variant="outlined" color="secondary" onClick={props.previousStep}>
            Back
          </Button>
        </div>
        <div className={classes.ForwardButtons}>
          {/* Deploy Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={props.deploy}
            className={classes.NextButton}
            style={{ marginLeft: '20px' }}
          >
            Deploy
          </Button>
        </div>
      </div>
    </CardContent>
  </div>
);

export default step3;
