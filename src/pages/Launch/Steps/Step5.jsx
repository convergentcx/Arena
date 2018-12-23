import React from 'react';
import {
  Button,
  CardContent,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from '@material-ui/core';
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
          text="By deploying this contract, you state your intention to provide the listed services
          in exchange for payment in your personal token. This is in no way legally binding and you
          can always change your mind about what services you offer at what prices. However, if you
          want people to buy your token helping you raise funds, you need to assure them that you 
          will continue to back its value. You can demonstrate that you will honor your token by 
          trying your best to provide the promised services whenever they are requested and paid 
          for."
        >
          <HelpOutline color="secondary" className={classes.HelpButton} />
        </HelpTooltip>
      </div>
      <Typography variant="h6" color="textPrimary">
        Review
      </Typography>
      <div className={classes.ExplainBox}>
        <Typography color="textPrimary">
          Quick check and deploy{' '}
          <span role="img" aria-label="emoji">
            🚀
          </span>
          . You can edit everything later, except for the token name and the token symbol.
        </Typography>
      </div>
      <div className={`${classes.FormBox} ${classes.ReviewBox}`}>
        <Grid container>
          <Grid item xs={10} style={{ marginTop: '2vh' }}>
            <TextField
              label="Token Name"
              value={`${props.name}`}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={2} style={{ marginTop: '2vh' }}>
            <TextField
              label="Ticker Symbol"
              value={`${props.symbol}`}
              InputProps={{
                readOnly: true,
              }}
              style={{ marginLeft: '30px' }}
            />
          </Grid>
          {props.description && (
            <div style={{ marginTop: '2vh', width: '100%' }}>
              <TextField
                label="Description"
                value={`${props.description}`}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                multiline
              />
            </div>
          )}
          {props.tags && (
            <div style={{ marginTop: '2vh', width: '100%' }}>
              <TextField
                label="Tags"
                value={`${props.tags}`}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                multiline
              />
            </div>
          )}
          {/* Services */}
          {props.service0 && (
            <Grid container>
              <Grid item md={10} style={{ marginTop: '2vh' }}>
                <TextField
                  label="Service 1"
                  value={`${props.service0}`}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                />
              </Grid>

              <Grid item md={2} style={{ marginTop: '2vh' }}>
                <TextField
                  label={'Price 1'}
                  value={`${props.price0} ${props.symbol}`}
                  style={{ marginLeft: '30px' }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          )}
          {props.service1 && (
            <Grid container>
              <Grid item md={10} style={{ marginTop: '2vh' }}>
                <TextField
                  label="Service 2"
                  value={`${props.service1}`}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                />
              </Grid>

              <Grid item md={2} style={{ marginTop: '2vh' }}>
                <TextField
                  label={'Price 1'}
                  value={`${props.price1} ${props.symbol}`}
                  style={{ marginLeft: '30px' }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          )}
          {props.service2 && (
            <Grid container>
              <Grid item md={10} style={{ marginTop: '2vh' }}>
                <TextField
                  label="Service 3"
                  value={`${props.service2}`}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                />
              </Grid>

              <Grid item md={2} style={{ marginTop: '2vh' }}>
                <TextField
                  label={'Price 1'}
                  value={`${props.price2} ${props.symbol}`}
                  style={{ marginLeft: '30px' }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          )}
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
