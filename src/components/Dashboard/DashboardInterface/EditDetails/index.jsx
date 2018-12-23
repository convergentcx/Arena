import React, { Component } from 'react';
import { Chip, Grid, Paper, TextField } from '@material-ui/core';
import Photo from '../../../Profile/Photo.jsx';

import makeBlockie from 'ethereum-blockies-base64';

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
        return <Chip key={index} label={tag} style={{ marginRight: '5px' }} />;
      });

    return (
      <Paper style={{ marginBottom: '16px' }}>
        <Grid container style={{ padding: '16px 0 16px 0' }}>
          <Grid
            item
            xs={4}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Photo
              pic={
                this.state.pic
                  ? 'data:image/jpeg;base64,' + this.state.pic
                  : makeBlockie(this.props.address)
              }
              width="100px"
            />
          </Grid>
          <Grid item xs={8} style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              id="standard-read-only-input"
              value={this.state.displayName}
              onChange={this.handleChange}
              margin="normal"
              InputProps={{
                readOnly: !this.state.editingProfile,
              }}
              style={{ width: '60%' }}
            />
            <div style={{ marginTop: '8px', marginBottom: '8px', display: 'flex' }}>{chips}</div>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}
