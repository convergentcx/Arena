// import IPFS from 'ipfs';
import Web3 from 'web3';

const getWeb3 = () => {
  if (window.ethereum) {
    // Modern dapp browsers...
    return new Web3(window.ethereum);
  } else if (window.web3) {
    // Legacy dapp browsers...
    return new Web3(window.web3.currentProvider);
  } else {
    // Non-dapp browsers...
    const web3 = new Web3(new Web3.providers.HttpProvider(defaultProviderUrl, 20000));
    web3.currentProvider.isOrigin = true;
    return web3;
  }
};

const web3 = getWeb3();
const ethereum = window.ethereum;

// const ipfsCreator = repo_key => {
//   const ipfsOptions = {
//     repo: 'ipfs' + repo_key,
//     EXPERIMENTAL: {
//       pubsub: true,
//       relay: {
//         enabled: true, // enable relay dialer/listener (STOP)
//         hop: {
//           enabled: true // make this node a relay (HOP)
//         }
//       }
//     },
//     config: {
//       Bootstrap: [], // it's ok to connect to more peers than this, but currently leaving it out due to noise.
//       Addresses: {
//        //Swarm: ['/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star']
//       }
//     }
//   }

//   const ipfs = new IPFS(ipfsOptions)

//   if (ipfsSwarm && ipfsSwarm != 'None') {
//     ipfs.on('start', async () => {
//       await ipfs.swarm.connect(ipfsSwarm)
//     })
//     ipfs.__reconnect_peers = {}
//     ipfs.__reconnect_peers[ipfsSwarm.split('/').pop()] = ipfsSwarm
//   }

//   return ipfs
// }
