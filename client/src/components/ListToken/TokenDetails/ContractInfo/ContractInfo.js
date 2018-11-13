import React, { Component } from 'react';
import { Col, Row, Form, FormGroup, Label } from 'reactstrap';



class ContractInfo extends Component {

    render() {

        return (
            <div>
                <Form>
                    <Row form>
                        <Col md={7}>
                            <FormGroup>
                                <Label>Contract Address</Label>
                                <p>{this.props.address}</p>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label>Name/Project</Label>
                                <p> {this.props.name} ({this.props.symbol})</p>
                            </FormGroup>
                        </Col>
                        <Col md={2}>
                            <FormGroup>
                                <Label>Balance</Label>
                                <p> {this.props.tokenBalance}</p>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md={7}>
                            <FormGroup>
                                <Label>Owner Address</Label>
                                <p>{this.props.owner}</p>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label>Current Price</Label>
                                <p> {this.props.currentPrice}</p>
                            </FormGroup>
                        </Col>
                        <Col md={2}>
                            <FormGroup>
                                <Label>Market Cap</Label>
                                <p> {this.props.marketCap}</p>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md={7}>
                            <FormGroup>
                                <Label for="exampleZip">Bonding Curve Formula</Label>
                                <p> p = 1/{this.props.invSlope} * x ^ {this.props.exponent}</p>
                            </FormGroup>
                        </Col>

                        <Col md={3}>
                            <FormGroup>
                                <Label for="exampleZip">Current Supply</Label>
                                <p> {this.props.totalSupply}</p>
                            </FormGroup>
                        </Col>
                        <Col md={2}>
                            <FormGroup>
                                <Label for="exampleCity">Pool Balance</Label>
                                <p> {this.props.poolBalance}</p>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>

            </div>
        )
    }
}

export default ContractInfo;