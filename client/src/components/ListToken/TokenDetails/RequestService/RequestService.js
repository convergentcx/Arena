import React from 'react';
import { Table, Button, Input } from 'reactstrap';

const multiplier = 10 ** 18;

class RequestService extends React.Component {

    state = {
        actions: {
            action1: '',
            action2: '',
            action3: ''
        },
        prices: {
            price1: '',
            price2: '',
            price3: '',
        },
        requestPrices: {
            requestPrice1: null,
            requestPrice2: null,
            requestPrice3: null
        },
        message: ''
    }

    inputChangedHandler = (e) => {
        this.setState({ message: e.target.value });
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.contract !== this.props.contract) {
            this.getMenu()
        }
        if (prevState.prices !== this.state.prices) {
            this.getRequestPrices()
        }
    }

    getRequestPrices = () => {
        this.props.contract && this.state.prices.price1 && this.props.contract.methods.priceToMint(`${this.state.prices.price1 * multiplier}`).call({ from: this.props.account }, (error, result) => {
            let requestPrices = { ...this.state.requestPrices };
            requestPrices.requestPrice1 = result / multiplier;
            this.setState({ requestPrices });
        });
        this.props.contract && this.state.prices.price2 && this.props.contract.methods.priceToMint(`${this.state.prices.price2 * multiplier}`).call({ from: this.props.account }, (error, result) => {
            let requestPrices = { ...this.state.requestPrices };
            requestPrices.requestPrice2 = result / multiplier;
            this.setState({ requestPrices });
        });
        this.props.contract && this.state.prices.price3 && this.props.contract.methods.priceToMint(`${this.state.prices.price3 * multiplier}`).call({ from: this.props.account }, (error, result) => {
            let requestPrices = { ...this.state.requestPrices };
            requestPrices.requestPrice3 = result / multiplier;
            this.setState({ requestPrices });
        });
    }

    getMenu = async () => {
        const { contract } = this.props;

        await contract && contract.methods.action1().call({ from: this.props.account }, (error, result) => {
            let actions = { ...this.state.actions }
            actions.action1 = result;
            this.setState({ actions })
        });

        await contract && contract.methods.action2().call({ from: this.props.account }, (error, result) => {
            let actions = { ...this.state.actions }
            actions.action2 = result;
            this.setState({ actions })
        });

        await contract && contract.methods.action3().call({ from: this.props.account }, (error, result) => {
            let actions = { ...this.state.actions }
            actions.action3 = result;
            this.setState({ actions })
        });

        await contract && contract.methods.prices(0).call({ from: this.props.account }, (error, result) => {
            let prices = { ...this.state.prices }
            prices.price1 = result;
            this.setState({ prices })
        });

        await contract && contract.methods.prices(1).call({ from: this.props.account }, (error, result) => {
            let prices = { ...this.state.prices }
            prices.price2 = result;
            this.setState({ prices })
        });

        await contract && contract.methods.prices(2).call({ from: this.props.account }, (error, result) => {
            let prices = { ...this.state.prices }
            prices.price3 = result;
            this.setState({ prices })
        });
    }
    // @dev TODO: SHOULD INCLUDE WHICH SERVICE IS BEING REQUESTED
    onRequestHandler = () => {
        const { contract, account } = this.props;
        const stackId =
            contract && contract.methods["request"].cacheSend(
                `${this.state.message}`,
                `${this.state.prices.price1 * multiplier}`,
                {
                    from: account,
                    value: this.state.requestPrices.requestPrice1 * multiplier
                });

        // save the `stackId` for later reference
        this.setState({ stackId });
    }

    render() {
        let actions = Object.entries(this.state.actions);
        let prices = Object.entries(this.state.prices);
        console.log(actions, prices);

        const menu = actions.map((action, i) => {
            let requestPriceAttribute = `requestPrice${i + 1}`;
            let priceAttribute = `price${i + 1}`;

            
            console.log(action[1])
            if (action[1] === '') {
                return null;
            }
            else {
                return (
                    <tr>
                        <td>{action[1]}</td>
                        <td>{prices[i][1]}</td>
                        <td> <Input value={this.state.message} onChange={this.inputChangedHandler} /></td>
                        <td><Button color="danger" onClick={this.onRequestHandler}>Request with {this.state.requestPrices[requestPriceAttribute]} ETH</Button></td>
                        <td><Button color="success" onClick={this.onPayHandler}>Request with {this.state.prices[priceAttribute]} SMBL</Button></td>
                    </tr>
                )
            }
        })

        return (
            <div>
                <Table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Price</th>
                            <th>Message</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {menu}
                    </tbody>
                </Table>
            </div>
        )
    }
}


export default RequestService;