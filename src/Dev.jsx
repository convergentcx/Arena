/// Development Testing Page

import React from 'react';

import { Button, Grid, Paper } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Photo from './components/Profile/Photo.jsx';
import InfoCard from './components/Profile/QuickFacts.jsx';
import ServiceBar from './components/Profile/SideServiceBar.jsx';

import Logan from './assets/logan.JPG';

class Dev extends React.Component {
  state = {
    value: 2,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    return (
      <div>
        <Paper square style={{ height: '68vh', width: '', marginLeft: '' }}>
          <Paper square style={{ background: 'teal', height: '80%' }}>
          </Paper>
          <div style={{ marginLeft: '40px', marginTop: '-150px', display: 'flex', flexDirection: 'row' }}>
            <Photo pic={Logan} width="200px" />
            <h1 style={{ color: '#000', paddingLeft: '20px', paddingTop: '95px' }}>Economy of Logan</h1>
          </div>
          <div style={{ marginLeft: '300px', marginTop: '-18px' }}>
            <Tabs
              value={this.state.value}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.handleChange}
            >
              <Tab label="Summary" />
              <Tab label="Contribute" disabled />
              <Tab label="Services" />
            </Tabs>
          </div>
          <div style={{ marginLeft: '1000px', marginTop: '-50px'}}>
            <Button color="secondary" size="large" variant="contained">
              CONTRIBUTE
            </Button>
          </div>
        </Paper>

        <Grid container spacing={16} style={{ padding: '4%', paddingTop: '16px' }}>
          <Grid item xs={3}>
            <InfoCard
              contributors={6}
              marketCap={12000}
              socials={{
                twitter: 'https://convergent.cx',
                facebook: 'https://convergent.cx',
                instagram: 'https://convergent.cx'
              }}
              width="100%"
            />
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus ornare semper. Nulla commodo lacinia turpis vitae aliquam. Suspendisse laoreet mollis nisl, semper placerat enim vestibulum at. Vestibulum volutpat vitae diam id tincidunt. Ut dignissim luctus molestie. Sed tellus enim, vestibulum eget odio nec, fringilla rhoncus tortor. Quisque lacinia risus vel velit molestie, id gravida dui bibendum. Nam urna enim, egestas ut aliquet at, volutpat a enim.
                Sed ornare libero vitae ipsum iaculis luctus. Nam molestie lectus mi. Nulla pellentesque auctor arcu, ac interdum erat feugiat nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed vel purus ut metus maximus consequat eleifend vel ex. Pellentesque mi augue, congue eget mattis vitae, varius quis nisi. Fusce lacinia augue arcu, quis elementum purus vestibulum lobortis. Sed consequat rhoncus sollicitudin. Aenean ultrices condimentum accumsan. Fusce rhoncus consequat felis sed aliquet. Vestibulum ullamcorper nulla ligula, non volutpat magna aliquet tempor. Vivamus commodo mauris orci. Nunc risus augue, ultrices ut placerat vel, dictum eget est. Aenean non dolor id tortor mollis rhoncus quis vel ex.
                Integer tempus venenatis tortor, sit amet consectetur justo malesuada ac. Phasellus nec dictum felis, sed porttitor odio. Vivamus nec ligula tortor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean eleifend nisi metus, et sodales quam commodo ac. Sed aliquam bibendum viverra. Donec commodo lacinia est, at convallis nibh blandit in. Maecenas fermentum nisl quis pellentesque egestas. Donec tempus, nisl et varius dapibus, sem nulla aliquam nibh, nec convallis lacus leo non nibh. Etiam ac vestibulum sem.
                Cras sit amet arcu eu arcu eleifend varius eget quis metus. Phasellus viverra ac metus at blandit. Fusce at leo ut sapien porttitor pulvinar et vel mauris. Phasellus cursus bibendum sapien. Nullam vehicula augue ac pulvinar dictum. Integer eu tortor et lorem lobortis iaculis non et tortor. Duis pharetra urna vitae turpis gravida consectetur. Vivamus posuere urna massa, sit amet venenatis mi sodales vitae. Nam sit amet molestie nisi. Nam sit amet nisl vitae enim euismod mattis vitae vel ex. Nam suscipit dignissim porttitor. Donec elementum ultricies magna finibus ultricies. Etiam sollicitudin nisi et risus faucibus, ut luctus libero laoreet.
                Morbi eleifend fermentum est. Praesent suscipit pharetra vulputate. Cras in pharetra quam. Sed aliquet cursus diam, et finibus massa varius quis. Phasellus mauris nibh, ornare faucibus eleifend dapibus, scelerisque sed risus. Cras dictum condimentum metus, at semper odio porta quis. Ut vitae porttitor est. Aliquam a tellus et orci molestie viverra. Proin congue elit leo, nec porttitor mauris accumsan eget. Phasellus convallis ligula mauris, et tristique diam eleifend ac. Aenean dictum pellentesque ullamcorper. Nunc eu mauris viverra lectus feugiat aliquet. Sed egestas iaculis consectetur. 
              </p>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <ServiceBar symbol="LGN" dataJson={{ services: [{ service: '123' }] }} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Dev;
