import React, { Component } from 'react';
import {
    Form, FormGroup, Input, Label, Button, Row, Col, InputGroup, InputGroupAddon
} from 'reactstrap';

import classes from './BuySell.module.css';

const multiplier = 10 ** 18;


class BuySell extends Component {

    state = {
        stackId: null,
        showBuy: true,
        token_amount: '0',
        priceInEther: 0,
        rewardInEther: 0,
        buyTokenAmount: '',
        sellTokenAmount: ''
    }

    changeTokenView = (showBuy) => {
        this.setState({ showBuy });
    }

    buyAmountChangeHandler = (event) => {
        // get buy price
        this.props.contract && this.props.contract.methods.priceToMint(`${event.target.value * multiplier}`).call({ from: this.props.account }, (error, result) => {
            this.setState({ priceInEther: result / multiplier });
        });
        this.setState({ buyTokenAmount: event.target.value });

    }

    sellAmountChangeHandler = (event) => {
        // get sell reward 
        this.props.contract && this.props.contract.methods.rewardForBurn(`${event.target.value * multiplier}`).call({ from: this.props.account }, (error, result) => {
            this.setState({ rewardInEther: result / multiplier });
        });
        this.setState({ sellTokenAmount: event.target.value });
    }

    onBuyHandler = () => {
        const buyStackId = this.props.contract.methods["mint"].cacheSend(
            `${this.state.buyTokenAmount * multiplier}`,
            {
                from: this.props.account,
                value: this.state.priceInEther * multiplier
            });
        this.setState({ buyStackId });

    }


    onSellHandler = () => {
        const sellStackId = this.props.contract.methods["burn"].cacheSend(
            `${this.state.sellTokenAmount * multiplier}`,
            {
                from: this.props.account,
            });
        this.setState({ sellStackId });
    }

    getTxStatus = (transactionStackId) => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = this.props.drizzleState;
    
        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[this.state[transactionStackId]];
    
        // if transaction hash does not exist, don't display anything
        if (!txHash) return null;
    
        // otherwise, return the transaction status
        return `Transaction status: ${transactions[txHash].status}`;
      };
    


    render() {

        return (
            <Row className={classes.Row}>
                        <Col md={6}>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <Button color="success" onClick={this.onBuyHandler}>Buy</Button>
                                </InputGroupAddon>
                                <Input
                                    placeholder={`${this.props.symbol}`}
                                    name="token_buy_amount"
                                    type="number"
                                    value={this.state.buyTokenAmount}
                                    onChange={this.buyAmountChangeHandler}
                                />
                                <InputGroupAddon addonType="append">{`With ${this.state.priceInEther.toFixed(3)} ETH`}</InputGroupAddon>


                            </InputGroup>
                            <div>{this.getTxStatus('buyStackId')}</div>
                        </Col>
                        <Col md={6}>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <Button color="danger" onClick={this.onSellHandler}>Sell</Button>
                                </InputGroupAddon>
                                <Input
                                    placeholder={`${this.props.symbol}`}
                                    name="token_sell_amount"
                                    type="number"
                                    value={this.state.sellTokenAmount}
                                    onChange={this.sellAmountChangeHandler}
                                />
                                <InputGroupAddon addonType="prepend">{`For ${this.state.rewardInEther.toFixed(3)} ETH`}</InputGroupAddon>
                            </InputGroup>
                            {this.getTxStatus('sellStackId')}
                        </Col>

            </Row >
        )
    }

}

export default BuySell;