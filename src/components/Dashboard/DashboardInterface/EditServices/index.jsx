import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { Paper } from '@material-ui/core';

class Services extends React.Component {
  state = {
    editingServices: false,
    jsonData: {},
  };

  toggleServiceEditable = () => {
    this.setState({ editingServices: !this.state.editingServices });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    let items = this.props.jsonData.services.map((serviceObj, i) => {
      return (
        <Grid container sm={12}>
          <Grid item sm={6}>
            <TextField
              name={`service-${i}`}
              value={this.state.editingServices ? this.state[`service-${i}`] : serviceObj.what}
              label={`Service`}
              onChange={this.handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                readOnly: !this.state.editingServices
              }}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              label={`Price`}
              name={`price-${i}`}
              value={this.state.editingServices ? this.state[`price-${i}`] : serviceObj.price}
              onChange={this.handleChange}
              type="number"
              InputLabelProps={{
                shrink: true
              }}
              margin="normal"
              InputProps={{
                readOnly: !this.state.editingServices
              }}
            />
          </Grid>
        </Grid>
      );
    });

    return (
      <Paper style={{ display: 'flex', flexDirection: 'column' }}>
        <Grid container style={{ padding: '2%' }}>
          <Typography color="textSecondary" gutterBottom>
            Your Services
          </Typography>
          {items}
        </Grid>
        <Button
          variant="contained"
          color={this.state.editingServices ? 'primary' : 'secondary'}
          style={{ justifySelf: 'flex-end' }}
          onClick={this.toggleServiceEditable}
        >
          {this.state.editingServices ? 'Save' : 'Edit'}
        </Button>
      </Paper>
    );
  }
}

export default Services;
