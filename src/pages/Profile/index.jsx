import React, { Component } from 'react';

import { Container, Modal, ModalBody, ModalHeader } from 'reactstrap';

class BuySell extends Component {
  
}

class ProfileDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ModalHeader toggle={() => this.props.history.goBack()}>
          Personal Economy of {this.props.addr}
        </ModalHeader>
        <ModalBody>
          <Container>
            
          </Container>
        </ModalBody>
      </div>
    )
  }
}

const Profile = (props) => (
  <Modal size="lg" isOpen={true} toggle={() => props.history.goBack()}>
    <ProfileDetails addr={props.match.params.tokenAddress} history={props.history} />
  </Modal>
);

export default Profile;
