import React from 'react';
import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
// import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

class Services extends React.Component {
  state = {
    editingServices: false,
    jsonData: {}
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
              label={`Service ${i}`}
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
              label={`Price ${i}`}
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
            {items}
          </form>
        </CardContent>
      </Card>
    );
  }
}

export default Services;
