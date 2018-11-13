import React, { Component } from "react";
import TokenSummary from './TokenSummary/TokenSummary';

import withContext from '../../hoc/withContext';
import { Container, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import classes from './ListToken.module.css';

class ListToken extends Component {
    constructor() {

        super();

        // create data set of random length

        this.state = {
            currentPage: 0,
            dataKey: null,
            instantiations: [],
        };

    }

    componentDidMount() {
        const { drizzle } = this.props;
        const contract = drizzle.contracts.MyTokenFactory;
        const dataKey = contract.methods["getInstantiations"].cacheCall()
        this.setState({ dataKey });
    }


    handleClick(e, index) {

        e.preventDefault();

        this.setState({
            currentPage: index
        });

    }


    render() {
        const { MyTokenFactory } = this.props.drizzleState.contracts;
        const instantiations = MyTokenFactory.getInstantiations[this.state.dataKey];
        const text = JSON.stringify(instantiations);
        let inst = null;
        if (text) {
            inst = JSON.parse(text).value
        };


        // @dev
        // extracting the individual contract data should be done here,
        // rather than having to carry down the entire drizzle objects to each contract's TokenSummary
        const contracts = inst && inst.map(address => {

            return (
                // <Link to={'/' + address} key={address} style={{ color: 'black', textDecoration: 'none' }}>
                <TokenSummary
                    address={address}
                    account={this.props.drizzleState.accounts[0]}
                    drizzle={this.props.drizzle}
                    drizzleState={this.props.drizzleState}
                />
                // </Link>
            )
        })

        return (
            <div className={classes.ListToken} id="browse">

                <Table borderless hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Market Cap</th>
                            <th>Services</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts}
                    </tbody>
                </Table>
            </div >

            // <Container className="text-center">
            //     {/* <Row>
            //         <Col md="12"> */}
            //     {contracts}
            //     {/* </Col>
            //     </Row> */}
            // </Container>
        )
    }
}

export default withContext(ListToken);