import React from 'react';
import { Input, Button } from 'reactstrap';
import Modal from '../Layout/Modal/Modal'
// import "./LaunchToken.css";
import withContext from '../../hoc/withContext';

class LaunchToken extends React.Component {
  state = {
    stackId: null,
    name: '',
    symbol: '',
    actions: ["Email me"],
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
    this.setState({
      actionCount: this.state.actionCount - 1,
      actions: this.state.actions.slice(0, -1),
      prices: this.state.prices.slice(0, -1)
    });
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
    for (let i = 0; i < actionCount; i++) {
      Actions.push(
        <div key={i}>
          <input
            name={`action${i}`}
            placeholder="Action"
            value={actions[i]}
            onChange={e => this.handleInputChange(e, i)}
          />
          <input
            name={`cost${i}`}
            placeholder="Cost"
            value={prices[i]}
            onChange={e => this.handleInputChange(e, i)}
          />
        </div>
      );
    }
    return (
      <Modal modalClosed={this.closeModal}>
        <div className="launch">
          <div className="launch-personal">
            <h4>Enter token details</h4>
            <div>
              <Input
                name="name"
                placeholder="Your name.."
                value={name}
                onChange={this.handleInputChange}
              />
              <Input
                name="symbol"
                placeholder="Teh token's symbol (no vowels)"
                value={symbol}
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <h4>What services do you commit to offer in exchange for token payment?</h4>
          <div className="launch-permissions">
            {Actions}
            {actionCount !== 0 && (
              <button onClick={() => this.handleRemoveAction()}>-</button>
            )}
            <button onClick={() => this.handleAddAction()}>+</button>
          </div>

        </div>

        <Button onClick={this.onDeployHandler}>Launch your personal attention token</Button>

        <div>{this.getTxStatus()}</div>

      </Modal>
    );
  }
}

export default withContext(LaunchToken);