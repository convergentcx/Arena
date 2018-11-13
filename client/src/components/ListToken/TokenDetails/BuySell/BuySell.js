import React, { Component } from 'react';
import {
    Form, FormGroup, Input, Label, Button, Row, Col, InputGroup, InputGroupAddon
} from 'reactstrap';

const multiplier = 10 ** 18;


class BuySell extends Component {

    state = {
        stackId: null,
        showBuy: true,
        token_amount: '0',
        priceInEther: null,
        rewardInEther: null,
        buyTokenAmount: null,
        sellTokenAmount: null
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
        //this.props.contract && this.props.contract.methods.mint(`${this.state.token_amount*multiplier}`).send({ from: this.props.account, value: this.state.priceInEther*multiplier });
        this.props.contract.methods["mint"].cacheSend(
            `${this.state.token_amount * multiplier}`,
            {
                from: this.props.account,
                value: this.state.priceInEther * multiplier
            });
    }


    onSellHandler = () => {
        this.props.contract.methods["burn"].cacheSend(
            `${this.state.token_amount * multiplier}`,
            {
                from: this.props.account,
            });
    }


    render() {

        return (
            <div>
                <Form>
                    <Row>
                        <Col md={6}>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">{`${this.state.priceInEther && this.state.priceInEther.toFixed(3)} ETH`}</InputGroupAddon>
                                <Input
                                    placeholder='Buy amount'
                                    name="token_buy_amount"
                                    type="number"
                                    value={this.state.buyTokenAmount}
                                    onChange={this.buyAmountChangeHandler}
                                />
                                <InputGroupAddon addonType="append">
                                    <Button color="success" onClick={this.onBuyHandler}>Buy</Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                        <Col md={6}>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">{`${this.state.rewardInEther} ETH`}</InputGroupAddon>
                                <Input
                                    placeholder='Buy amount'
                                    name="token_sell_amount"
                                    type="number"
                                    value={this.state.sellTokenAmount}
                                    onChange={this.sellAmountChangeHandler}
                                />
                                <InputGroupAddon addonType="append">
                                    <Button color="danger" onClick={this.onSellHandler}>Sell</Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>

                    </Row>
                </Form>

            </div >
        )
    }

}

export default BuySell;