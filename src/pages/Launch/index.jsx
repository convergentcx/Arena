import React, { Component } from 'react';
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  Row
} from 'reactstrap';

import withContext from '../../hoc/withContext';

class LaunchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: 0,
      stackId: null,
      tooFew: false,
      tooMany: false
    };
  }

  addService = () => {
    this.state.rows === 2
      ? this.setState({ tooMany: true })
      : this.setState({ rows: this.state.rows + 1 });
  };

  deploy = () => {
    const {
      drizzle: {
        contracts: { PersonalEconomyFactory }
      },
      drizzleState
    } = this.props;
    const stackId = PersonalEconomyFactory.methods.create.cacheSend('', '', '', '', '', [0, 0, 0], {
      from: drizzleState.accounts[0]
    });
    this.setState({ stackId });
  };

  removeService = () => {
    this.state.rows === 0
      ? this.setState({ tooFew: true })
      : this.setState({ rows: this.state.rows - 1 });
  };

  waitUntilMined = () => {
    const { transactions, transactionStack } = this.props.drizzleState;
    const txHash = transactionStack[this.state.stackId];
    if (!txHash) return null;
    if (transactions[txHash].status === 'success') {
      setTimeout(() => this.props.history.push('/'), 1000);
    }
    return `Transaction status: ${transactions[txHash].status}`;
  };

  render() {
    let moreServices = [];

    const renderRows = () => {
      let i = 0;
      while (i < this.state.rows) {
        moreServices.push(
          <Row form key={i + 1}>
            <Col md={6}>
              <FormGroup>
                <Input type="text" name={`service-${i + 1}`} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Input type="text" name={`price-${i + 1}`} />
              </FormGroup>
            </Col>
          </Row>
        );
        i++;
      }
    };

    renderRows();

    return (
      <Form>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label>Name:</Label>
              <Input type="text" name="name" placeholder="" />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Symbol:</Label>
              <Input type="text" name="symbol" placeholder="" />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label>Service:</Label>
              <Input type="text" name="action-0" />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Price:</Label>
              <Input type="text" name="price-0" />
            </FormGroup>
          </Col>
        </Row>
        {moreServices}
        <ButtonGroup style={{ marginBottom: '10px' }}>
          <Button onClick={this.removeService}>-</Button>
          <Button onClick={this.addService}>+</Button>
        </ButtonGroup>
        <br />
        {this.state.tooMany && (
          <Alert color="warning" style={{ marginBottom: '0px' }}>
            For now, the number of services you can offer under one token is limited to 3
          </Alert>
        )}
        {this.state.tooFew && (
          <Alert color="warning" style={{ marginBottom: '0px' }}>
            For your token economy to work, you need to offer at least one service
          </Alert>
        )}
        <Button color="primary" onClick={this.deploy}>
          Deploy
        </Button>
        <div>{this.waitUntilMined()}</div>
      </Form>
    );
  }
}

const LaunchFormContextualized = withContext(LaunchForm);

const Launch = props => (
  <Modal size="lg" isOpen toggle={() => props.history.goBack()}>
    <ModalHeader>Launch</ModalHeader>
    <div style={{ padding: '6px' }}>
      <LaunchFormContextualized history={props.history} />
    </div>
  </Modal>
);

export default Launch;
