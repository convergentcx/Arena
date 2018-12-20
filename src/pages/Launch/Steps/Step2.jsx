import React from 'react';
import { Avatar, Button, CardContent, Grid, TextField, Typography } from '@material-ui/core';
import Dropzone from 'react-dropzone';
import classes from './Steps.module.css';
import { Close } from '@material-ui/icons';
import { HelpOutline } from '@material-ui/icons';
import HelpTooltip from './HelpTooltip';

const step2 = props => (
  <div className={classes.StepBox}>
    <CardContent>
      <div className={classes.Header}>
        <Typography variant="h5" color="primary.main">
          Step {props.currentStep} / {props.totalSteps}
        </Typography>
        <Close color="secondary" className={classes.CloseButton} onClick={props.cancel} />
        <HelpTooltip
          text="Name and symbol are the only two inputs that are required to launch your token.
         They get written to the blockchain and cannot be changed later. 
         All other information is linked to your token contract via IPFS and can be 
         added or updated at any time."
        >
          <HelpOutline color="secondary" className={classes.HelpButton} />
        </HelpTooltip>
      </div>
      <Typography variant="h6" color="primary.main">
        Basics
      </Typography>
      <div className={classes.ExplainBox}>
        <Typography color="primary.main">Give your token a name and a visual identity.</Typography>
      </div>
      <div className={classes.FormBox}>
        <Grid container>
          <Grid item sm={12} md={3} style={{ background: '' }}>
            {/* Upload Image */}
            <div style={{ height: '200px', width: '200px', margin: 'auto', borderRadius: '50%' }}>
              <Dropzone
                accept="image/*"
                onDrop={props.onDrop}
                style={{
                  border: 'none',
                }}
              >
                {({ getRootProps, getInputProps }) =>
                  props.file ? (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Avatar
                        src={props.file}
                        style={{ height: '200px', width: '200px', margin: 'auto' }}
                      />
                    </div>
                  ) : (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Avatar
                        style={{ height: '200px', width: '200px', margin: 'auto' }}
                        {...getRootProps()}
                      >
                        Click to Upload
                      </Avatar>
                    </div>
                  )
                }
              </Dropzone>
            </div>
          </Grid>
          <Grid item sm={12} md={9}>
            <div>
              <TextField
                fullWidth
                required
                label="Token Name"
                type="text"
                name="name"
                placeholder=""
                onChange={props.inputUpdate}
                helperText="Choose a name that conveys the
                 nature of the value you want to tokenize"
                style={{ margin: '10px' }}
              />
              <TextField
                fullWidth
                required
                label="Ticker Symbol"
                type="text"
                name="symbol"
                placeholder=""
                onChange={props.inputUpdate}
                helperText="This will be the shorthand identifier for your token"
                style={{ margin: '10px' }}
                InputProps={{ inputProps: { maxLength: 5, style: { textTransform: 'uppercase' } } }}
              />
            </div>
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
          <div className={classes.SkipNote}>
            <Typography>
              You can go straight to deploy from here and add the remaining details later.
            </Typography>
          </div>
          <Button
            variant="outlined"
            color="primary"
            onClick={props.lastStep}
            className={classes.SkipButton}
          >
            Deploy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (!props.name || !props.symbol) {
                return alert('Please enter a token name and symbol.');
              } else {
                return props.nextStep();
              }
            }}
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

export default step2;
