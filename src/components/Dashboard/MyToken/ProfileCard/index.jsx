import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Photo from '../../../Profile/Photo.jsx';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

class ProfileCard extends React.Component {
  state = {
    multiline:
      'Whoever pays me in token will get my full attention I am very good at listening to peoples problems and helping',
    editingProfile: false,
    displayName: 'My Token'
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
      <Grid item md={4} xs={12}>
        <Card style={{ height: '100%', position: 'relative' }}>
          <CardHeader
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
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default ProfileCard;
