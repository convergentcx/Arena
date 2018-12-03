import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

class Services extends React.Component {
  state = {
    editingServices: false,
    price1: ''
  };

  toggleServiceEditable = () => {
    this.setState({ editingServices: !this.state.editingServices });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return (
      <Card style={{ position: 'relative' }}>
        <Button
          color={this.state.editingServices ? 'primary' : 'secondary'}
          size="sm"
          style={{ position: 'absolute', top: '2%', right: '2%' }}
          onClick={this.toggleServiceEditable}
        >
          {this.state.editingServices ? 'Save' : 'Edit'}
        </Button>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Your Services
          </Typography>
          <form noValidate autoComplete="off">
            <Grid container sm={12}>
              <Grid item sm={6}>
                <TextField
                  required
                  id="standard-required"
                  label="req"
                  defaultValue="Service 1"
                  value={this.state.service1}
                  onChange={this.handleChange('service1')}
                  margin="normal"
                  InputProps={{
                    readOnly: !this.state.editingServices
                  }}
                />
              </Grid>
              <Grid item sm={6}>
                <TextField
                  id="standard-number"
                  label="Number"
                  value={this.state.price}
                  onChange={this.handleChange('price1')}
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
          </form>
        </CardContent>
      </Card>
    );
  }
}

export default Services;
