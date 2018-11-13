import React from 'react';
import { Input, Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Col, Row, Form, FormGroup, Label, FormText } from 'reactstrap';
// import "./LaunchToken.css";
import withContext from '../../hoc/withContext';

class LaunchToken extends React.Component {
  state = {
    stackId: null,
    name: '',
    symbol: '',
    actions: ['Email me'],
    actionCount: 1,
    prices: [10],
    transactionStatus: null
  }


  handleInputChange = (event, i) => {
    const { target } = event;
    const { value } = target;
    let { name } = target;
    if (i !== undefined) {
      if (/\b(action).*/.test(name)) {
        this.setState({
          actions: this.state.actions
            .slice(0, i)
            .concat(value)
            .concat(this.state.actions.slice(i + 1))
        });
      } else {
        this.setState({
          prices: this.state.prices
            .slice(0, i)
            .concat(value)
            .concat(this.state.prices.slice(i + 1))
        });
      }
    } else {
      this.setState({ [name]: value });
    }
  }

  handleRemoveAction = () => {
    if (this.state.actionCount <= 1) {
      alert('For this early test version, the number of services you can offer is limited to 3')
    }
    else {
      this.setState({
        actionCount: this.state.actionCount - 1,
        actions: this.state.actions.slice(0, -1),
        prices: this.state.prices.slice(0, -1)
      });
    }
  }

  handleAddAction = () => {
    if (this.state.actionCount >= 3) {
      alert('For this early test version, the number of services you can offer is limited to 3')
    }
    else {
      this.setState({ actionCount: this.state.actionCount + 1 });
      this.state.actions.push();
    };
  }

  onDeployHandler = () => {
    this.createToken();
  }

  createToken = () => {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.MyTokenFactory;
    console.log(this.state.actions[0], this.state.actions[1], this.state.actions[2], this.state.prices )
    // let drizzle know we want to call the `set` method with `value`
    const stackId =
      contract.methods["create"].cacheSend(
        this.state.name,
        this.state.symbol,
        this.state.actions[0],
        this.state.actions[1] ? this.state.actions[1] : "",
        this.state.actions[2] ? this.state.actions[2] : "",
        this.state.prices,
        {
          from: drizzleState.accounts[0]
        });

    // save the `stackId` for later reference
    this.setState({ stackId });
  };

  getTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    // otherwise, return the transaction status
    if (transactions[txHash].status == 'success') {
      setTimeout(() => this.props.history.push('/'), 1000)
    }
    return `Transaction status: ${transactions[txHash].status}`;
  };


  closeModal = () => {
    this.props.history.goBack()
  }

  render() {
    const { name, symbol, actionCount, actions, prices } = this.state;
    let Actions = [];
    for (let i = 1; i < actionCount; i++) {
      Actions.push(
        <Row form key={i}>
          <Col md={8}>
            <FormGroup>
              <Input type="text" name={`action${i}`} placeholder="think of something fun" id="exampleCity" value={actions[i]} onChange={e => this.handleInputChange(e, i)} />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Input type="text" name={`price${i}`} placeholder="prices can be updated" id="exampleZip" value={prices[i]} onChange={e => this.handleInputChange(e, i)} />
            </FormGroup>
          </Col>
        </Row>
      );
    }
    return (
      <Modal size="lg" isOpen={true} toggle={this.closeModal}>
        <ModalHeader toggle={this.closeModal}>Launch your personal economy</ModalHeader>
        <ModalBody>

          <Form>
            <Row form>
              <Col md={8}>
                <FormGroup>
                  <Label for="exampleEmail">Your name / project</Label>
                  <Input type="text" name="name" id="exampleEmail" placeholder="whatever you wanna call this" onChange={this.handleInputChange} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="examplePassword">Token symbol</Label>
                  <Input type="text" name="symbol" id="examplePassword" placeholder="make it shill" onChange={this.handleInputChange} />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={8}>
                <FormGroup>
                  <Label for="exampleCity">Service</Label>
                  <Input type="text" name={`action${1}`} placeholder="something you can do for the world" value={actions[0]} onChange={e => this.handleInputChange(e, 1)} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="exampleZip">Price</Label>
                  <Input type="text" name={`price${1}`} placeholder="what you want in exchange" value={prices[0]} onChange={e => this.handleInputChange(e, 1)} />
                </FormGroup>
              </Col>
            </Row>
            {Actions}
            <FormGroup check>
              <Input type="checkbox" name="check" id="exampleCheck" />
              <Label for="exampleCheck" check>I commit to providing the above services at the specified prices for the foreseeable future</Label>
            </FormGroup>
          </Form>

          {actionCount !== 0 && (
            <button onClick={() => this.handleRemoveAction()}>-</button>
          )}
          <button onClick={() => this.handleAddAction()}>+</button>

        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={this.onDeployHandler}>Deploy personal token</Button>
          <div>{this.getTxStatus()}</div>
        </ModalFooter>

      </Modal>
    );
  }
}

export default withContext(LaunchToken);