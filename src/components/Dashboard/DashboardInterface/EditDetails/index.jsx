import React, { Component } from 'react';
import { Chip, Grid, Paper, TextField } from '@material-ui/core';
import Photo from '../../../Profile/Photo.jsx';

export default class EditDetails extends Component {
  state = {
    editingProfile: false,
    displayName: this.props.jsonData.name,
  };

  async componentDidMount() {
    const { image } = this.props.jsonData;
    let pic = '';
    if (image.data) {
      pic = Buffer.from(image.data).toString('base64');
    }
    this.setState({ pic });
  }

  toggleProfileEditable = () => {
    this.setState({ editingProfile: !this.state.editingProfile });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const chips =
      this.props.jsonData.tags &&
      this.props.jsonData.tags.map((tag, index) => {
        return <Chip key={index} label={tag} />;
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
                readOnly: !this.state.editingProfile,
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              marginTop: '8px',
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            {chips}
          </Grid>
        </Grid>
      </Paper>
    );
  }
}
