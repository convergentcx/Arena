import React from 'react';
import { Table, Button, Input } from 'reactstrap';

const multiplier = 10 ** 18;

class RequestService extends React.Component {

    state = {
        message: ''
    }

    inputChangedHandler = (e) => {
        this.setState({ message: e.target.value });
    }

    // @dev TODO: SHOULD INCLUDE WHICH SERVICE IS BEING REQUESTED 
    // NOW ONLY WORKING FOR FIRST SERVICE
    onRequestWithEthHandler = () => {
        const { contract, account } = this.props;
        const stackId =
            contract && contract.methods["requestWithEth"].cacheSend(
                `${this.state.message}`,
                `${this.props.prices.price1 * multiplier}`,
                {
                    from: account,
                    value: this.state.requestPrices.requestPrice1 * multiplier
                });

        // save the `stackId` for later reference
        this.setState({ stackId });
    }

    onRequestWithTokenHandler = () => {
        const { contract, account } = this.props;
        const stackId =
            contract && contract.methods["requestWithToken"].cacheSend(
                `${this.state.message}`,
                {
                    from: account,
                });

        // save the `stackId` for later reference
        this.setState({ stackId });
    }


    
    render() {
        let actions = Object.entries(this.props.actions);
        let prices = Object.entries(this.props.prices);
        const menu = actions.map((action, i) => {
            let requestPriceAttribute = `requestPrice${i + 1}`;
            let priceAttribute = `price${i + 1}`;            
            if (action[1] === '') {
                return null;
            }
            else {
                return (
                    <tr>
                        <td>{action[1]}</td>
                        <td>{prices[i][1]}</td>
                        <td> <Input value={this.state.message} onChange={this.inputChangedHandler} /></td>
                        <td><Button color="danger" onClick={this.onRequestWithEthHandler}>Request with {this.props.requestPrices[requestPriceAttribute]} ETH</Button></td>
                        <td><Button color="success" onClick={this.onRequestWithTokenHandler}>Request with {this.props.prices[priceAttribute]} {this.props.symbol}</Button></td>
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