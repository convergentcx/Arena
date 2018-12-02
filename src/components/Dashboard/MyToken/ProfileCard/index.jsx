import React from 'React';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// const classes = {
//     card: {
//         minWidth: 200,
//         position: 'relative'
//     },
//     container: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     textField: {
//         marginLeft: 0,
//         marginRight: 0,
//         width: 200,
//     },
//     bigAvatar: {
//         margin: 10,
//         width: 60,
//         height: 60,
//     },
//     chip: {
//         margin: 1,
//     },
//     editButton: {
//         position: 'absolute',
//         right: '2%',
//         top: '3%'
//     }
// };

class ProfileCard extends React.Component {

    state = {
        multiline: 'Whoever pays me in token will get my full attention I am very good at listening to peoples problems and helping',
        editingProfile: false,
        displayName: 'My Token',
    }

    render() {       
        return (
            <Card style={{ height: '100%' }}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="Recipe">
                            R
            </Avatar>
                    }
                    title={
                        <TextField
                            id="standard-read-only-input"
                            value={this.state.displayName}
                            onChange={this.handleChange('displayName')}
                            margin="normal"
                            InputProps={{
                                readOnly: !this.state.editingProfile,
                            }}
                        />
                    }
                    // What follows is an idea for how people could give themselves tags. Not sure how/if we 
                    // should add these for the alpha

                    subheader={
                        <div>
                            <Chip label="blockchain"  />
                            <Chip label="mentorship" />
                        </div>
                    }
                />
                <Button color={this.state.editingProfile ? 'primary' : 'secondary'} size="sm" onClick={this.toggleEditable}>
                    {this.state.editingProfile ? 'Save' : 'Edit'}
                </Button>
                <CardContent>
                    <form noValidate autoComplete="off">

                        <TextField
                            id="standard-full-width"
                            value={this.state.multiline}
                            onChange={this.handleChange('multiline')}
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
                                readOnly: !this.state.editingProfile,
                            }}
                        />

                    </form>

                </CardContent>
            </Card>
        );
    }
}

export default ProfileCard;