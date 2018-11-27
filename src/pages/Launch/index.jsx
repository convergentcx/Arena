import React, { Component } from 'react';
import {
  Alert,
  ButtonGroup,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap';

import { Button } from '@material-ui/core';

import ipfsApi from 'ipfs-api';

import withContext from '../../hoc/withContext';

import { getBytes32FromMultihash } from '../../util';

const ipfs = ipfsApi('ipfs.infura.io', '5001', { protocol: 'https' });

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
      : this.setState({ rows: this.state.rows + 1, tooFew: false });
  };

  deploy = async () => {
    const {
      drizzle: {
        contracts: { PersonalEconomyFactory }
      },
      drizzleState
    } = this.props;

    const dataJson = {
      name: this.state.name,
      symbol: this.state.symbol,
      services: []
    };

    for (let i = 0; i <= this.state.rows; i++) {
      dataJson.services.push({ what: this.state[`service-${i}`], price: this.state[`price-${i}`] });
    }

    const ipfsHash = await this.submitHash(JSON.stringify(dataJson));

    const mhash = getBytes32FromMultihash(ipfsHash[0].path);
    const stackId = PersonalEconomyFactory.methods.create.cacheSend(
      mhash.digest,
      this.state.name,
      this.state.symbol,
      {
        from: drizzleState.accounts[0]
      }
    );
    this.setState({ stackId });
  };

  removeService = () => {
    this.state.rows === 0
      ? this.setState({ tooFew: true })
      : this.setState({ rows: this.state.rows - 1, tooMany: false });
  };

  submitHash = async data => {
    const result = await ipfs.add(Buffer.from(data));
    return result;
  };

  inputUpdate = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
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
                <Input type="text" name={`service-${i + 1}`} onChange={this.inputUpdate} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Input type="text" name={`price-${i + 1}`} onChange={this.inputUpdate} />
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
              <Input type="text" name="name" placeholder="" onChange={this.inputUpdate} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Symbol:</Label>
              <Input type="text" name="symbol" placeholder="" onChange={this.inputUpdate} />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label>Service:</Label>
              <Input type="text" name="service-0" onChange={this.inputUpdate} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Price:</Label>
              <Input type="text" name="price-0" onChange={this.inputUpdate} />
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
          <Alert color="warning" style={{ marginBottom: '10px' }}>
            While we build 🛠 only 3 services will be available in your economy 💸 
          </Alert>
        )}
        {this.state.tooFew && (
          <Alert color="warning" style={{ marginBottom: '10px' }}>
            For your economy to work 👨‍💼 you need to offer at least one service 🗳
          </Alert>
        )}
        <Button size="medium" variant="contained" onClick={this.deploy}>
          Deploy
        </Button>
        <div>{this.waitUntilMined()}</div>
      </Form>
    );
  }
}

const LaunchFormContextualized = withContext(LaunchForm);

const Launch = props => (
  <div style={{ padding: '10%' }}>
    <LaunchFormContextualized history={props.history} />
  </div>
);

export default Launch;
