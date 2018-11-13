import React, { Component } from 'react';
import {
    Form, FormGroup, Input, Label, Button,
} from 'reactstrap';

const multiplier = 10 ** 18;


class BuySell extends Component {

    state = {
        stackId: null,
        showBuy: true,
        token_amount: '',
        priceInEther: null,
        rewardInEther: null
    }

    changeTokenView = (showBuy) => {
        this.setState({ showBuy });
    }

    amountChangeHandler = (event) => {
        // get buy price
        this.props.contract && this.props.contract.methods.priceToMint(`${event.target.value * multiplier}`).call({ from: this.props.account }, (error, result) => {
            this.setState({ priceInEther: result/multiplier });
        });

        // get sell reward 
        this.props.contract && this.props.contract.methods.rewardForBurn(`${event.target.value * multiplier}`).call({ from: this.props.account }, (error, result) => {
            this.setState({ rewardInEther: result/multiplier });
        });
        this.setState({ token_amount: event.target.value });
    }

    onBuyHandler = () => {
        //this.props.contract && this.props.contract.methods.mint(`${this.state.token_amount*multiplier}`).send({ from: this.props.account, value: this.state.priceInEther*multiplier });
        this.props.contract.methods["mint"].cacheSend(
            `${this.state.token_amount*multiplier}`,
            {
              from: this.props.account,
              value: this.state.priceInEther*multiplier
            });      
    }


    onSellHandler = () => {
        this.props.contract.methods["burn"].cacheSend(
            `${this.state.token_amount*multiplier}`,
            {
              from: this.props.account,
            });    
    }


    render() {

        return (
            <div>
                <div className="buySelContainer">
                    <div className="buySellBox">
                        <span onClick={() => this.changeTokenView(true)}>Buy</span>
                        <span onClick={() => this.changeTokenView(false)}>Sell</span>
                    </div>
                </div>
                {this.state.showBuy ? (
                    <div>
                        <p>Buy Personal Attention Token</p>
                        <Form className="swapBox">
                            <FormGroup>
                                <Label for="hangoutPlaces">Amount of Token</Label>
                                <Input
                                    name="token_amount"
                                    type="number"
                                    value={this.state.token_amount}
                                    onChange={this.amountChangeHandler}
                                />
                            </FormGroup>
                            {/* <img src="assets/20-icon-lock_2.svg" color="#c3cfd9" className="swap" /> */}
                            <FormGroup>
                                <Label for="hangoutPlaces">Price in ETH</Label>
                                {/* <Input type="number" value={this.state.priceInEther} /> */}
                                <div>{this.state.priceInEther && this.state.priceInEther.toFixed(3)}</div>

                            </FormGroup>
                        </Form>
                        <div className="buyBtnBox">
                            <Button className="buyBtn" onClick={this.onBuyHandler}>
                                {`Buy ${this.state.token_amount} on Testnet`}
                            </Button>
                        </div>
                    </div>
                ) : (
                        <div>
                            <p>Sell Personal Attention Token</p>
                            <Form className="swapBox">
                                <FormGroup>
                                    <Label for="hangoutPlaces">Amount of Token</Label>
                                    <Input
                                        name="token_amount"
                                        type="number"
                                        value={this.state.token_amount}
                                        onChange={this.amountChangeHandler}
                                    />
                                </FormGroup>
                                {/* <img src="assets/20-icon-lock.svg" color="#c3cfd9" className="swap" /> */}
                                <FormGroup>
                                    <Label for="hangoutPlaces">Reward in ETH</Label>
                                    {/* <Input type="number" value={this.state.priceToEtherSell} /> */}
                                    <div>{this.state.rewardInEther && this.state.rewardInEther.toFixed(3)}</div>
                                </FormGroup>
                            </Form>
                            <div className="buyBtnBox">
                                <Button className="buyBtn" onClick={this.onSellHandler}>
                                    {`Sell ${this.state.token_amount} GEEK on Testnet`}
                                </Button>
                            </div>
                        </div>
                    )}
            </div>
        )
    }

}

export default BuySell;