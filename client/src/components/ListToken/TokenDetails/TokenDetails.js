import React, { Component } from 'react'
import {
    Alert,
    Card,
    CardBody,
    CardTitle,
    CardText,
    CardImg,
    CardFooter,
    Form,
    FormGroup,
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import EthPolynomialCurvedToken from '../../../contracts/EthPolynomialCurvedToken.json';
import ContractInfo from './ContractInfo/ContractInfo';
import BuySell from './BuySell/BuySell';
import withContext from '../../../hoc/withContext';


//const multiplier = 10 ** 18;


class ListCard extends Component {

    state = {
        tokenContract: null,
        tokenPurchaseAmount: null,
        price: null,
        reward: null
    }


    componentDidMount = async () => {
        const { drizzle } = this.props;
        const address = this.props.match.params.tokenAddress;
        const contractConfig = {
            contractName: address,
            web3Contract: new drizzle.web3.eth.Contract(
                EthPolynomialCurvedToken['abi'],
                address
            )
        };
        //TODO: should listen to Minted, Burned events and update component when they get fired
        let events = ['Minted', 'Burned'];
        await drizzle.addContract(contractConfig, events);
        const contract = drizzle.contracts[address];
        this.setState({ drizzleContract: contract })

        // WITHOUT DRIZZLE / USING PLAIN WEB3
        // try {

        // var web3 = await new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        // const contract_instance = await new web3.eth.Contract(abi, this.props.address);
        // this.setState({tokenContract: contract_instance});
        // } catch (error) {
        //     // Catch any errors for any of the above operations.
        //     alert(
        //       `Failed to load web3, accounts, or contract. Check console for details.`
        //     );
        //     console.log(error);
        //   }
    }

    closeModal = () => {
        this.props.history.goBack()
    }

    render() {

        return (
            <Modal size="lg" isOpen={true} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    Details
                </ModalHeader>
                <ModalBody>
                    <ContractInfo contract={this.state.drizzleContract} drizzleState={this.props.drizzleState} address={this.props.match.params.tokenAddress} account={this.props.drizzleState.accounts[0]} />
                </ModalBody>
                <BuySell contract={this.state.drizzleContract} address={this.props.match.params.tokenAddress} account={this.props.drizzleState.accounts[0]} />
                <ModalFooter>
                </ModalFooter>
            </Modal>
        )
    }
}

export default withContext(ListCard);
