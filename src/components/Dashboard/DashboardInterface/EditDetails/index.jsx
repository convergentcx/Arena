import React, { Component } from 'react';
import { Chip, Grid, Paper, TextField } from '@material-ui/core';
import Photo from '../../../Profile/Photo.jsx';

export default class EditDetails extends Component {
  state = {
    multiline:
      'Whoever pays me in token will get my full attention I am very good at listening to peoples problems and helping',
    editingProfile: false,
    displayName: this.props.jsonData.name,
  };

  async componentDidMount() {
    const { image } = this.props.jsonData;
    const pic = Buffer.from(image.data).toString('base64');
    this.setState({ pic });
  }

  toggleProfileEditable = () => {
    this.setState({ editingProfile: !this.state.editingProfile });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const chips = this.props.jsonData.tags.map(tag => {
      return <Chip label={tag} />;
    });

    return (
      <Paper style={{ height: '', marginBottom: '16px' }}>
        <Grid container>
          <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
            <Photo pic={'data:image/jpeg;base64,' + this.state.pic} width="100px" />
          </Grid>
          <Grid item xs={8} style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              id="standard-read-only-input"
              value={this.state.displayName}
              onChange={this.handleChange}
              margin="normal"
              InputProps={{
                readOnly: !this.state.editingProfile
              }}
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-around' }}>
            {chips}
          </Grid>
        </Grid>
        {/* <CardHeader
          avatar={<Photo pic={'data:image/jpeg;base64,' + this.state.pic} width="100px" />}
          title={
            <TextField
              id="standard-read-only-input"
              value={this.state.displayName}
              onChange={this.handleChange}
              margin="normal"
              InputProps={{
                readOnly: !this.state.editingProfile
              }}
            />
          }
          // What follows is an idea for how people could give themselves tags. Not sure how/if we
          // should add these for the alpha

          subheader={<div>{chips}</div>}
        />
        <Button
          color={this.state.editingProfile ? 'primary' : 'secondary'}
          size="sm"
          onClick={this.toggleProfileEditable}
          style={{ position: 'absolute', top: '2%', right: '2%' }}
        >
          {this.state.editingProfile ? 'Save' : 'Edit'}
        </Button>
        <CardContent>
          <form noValidate autoComplete="off">
            <TextField
              name="description"
              value={
                this.state.editingProfile
                  ? this.state.description
                  : this.props.jsonData.description
              }
              onChange={this.handleChange}
              label="Description"
              style={{ margin: 8 }}
              placeholder="My token will give you .."
              helperText="Tell your investors why you are going to the moon"
              fullWidth
              multiline
              // rows="4"
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                readOnly: !this.state.editingProfile
              }}
            />
          </form>
        </CardContent> */}
      </Paper>
    );
  }
}
