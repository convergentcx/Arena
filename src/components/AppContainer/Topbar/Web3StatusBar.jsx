import React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { faBroadcastTower } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';

import MetamaskLogin from './MetamaskLogin';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ColorIndicatorIcon = styled(FontAwesomeIcon)`
  color: ${props => props.enabled};
  transition: 1s linear 0s;
`;
// `
//   ${props => props.enabled !== 'red' &&
//     `-webkit-filter: drop-shadow( 0px 0px 2px ${props.enabled} );
//     filter: drop-shadow( 0px 0px 2px ${props.enabled} );`
//   }
// `

class EthStatus extends React.Component {
  state = {
    enabled: true,
  };

  // componentDidMount() {
  //   setInterval(() => {
  //     this.setState({ enabled: !this.state.enabled });
  //     console.log(this.state.enabled)
  //   }, 1000);
  // }

  render() {
    return (
      <div style={{ paddingRight: '20px' }}>
        <ColorIndicatorIcon icon={faEthereum} enabled={this.state.enabled ? '#25C261' : 'red'} />
      </div>
    );
  }
}

// class IpfsStatus extends React.Component {
//   render() {
//     return (
//       <div>
//         <ColorIndicatorIcon icon={faBroadcastTower} enabled={'#25C261'} />
//       </div>
//     );
//   }
// };

const Web3Panel = props => (
  <Container>
    <EthStatus />
    {/* <IpfsStatus /> */}
    <MetamaskLogin />
  </Container>
);

export default Web3Panel;
