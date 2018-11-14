import React, { Component } from 'react';
import { Col, Row, Form, FormGroup, Label, Card, CardHeader, CardBody, CardImg } from 'reactstrap';

import classes from './ContractInfo.module.css'

class ContractInfo extends Component {

    render() {

        return (
            <div>
                <Row className={classes.Row}>
                    <Col md={6}>
                        <Card>
                            <CardHeader>Market Cap</CardHeader>
                            <p>{this.props.marketCap} ETH</p>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card>
                            <CardHeader>You own</CardHeader>
                            <p> {this.props.tokenBalance}</p>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardHeader>About {this.props.name}</CardHeader>
                            <CardBody>Hi I am Hanna - I like to get paid when someone wants something from me..</CardBody>
                            <CardImg top width="100%" height="20%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=100" alt="Card image cap" ></CardImg>
                        </Card>
                    </Col>
                </Row>
         

            </div >
        )
    }
}

export default ContractInfo;