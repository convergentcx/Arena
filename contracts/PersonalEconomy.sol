pragma solidity ^0.4.24;

import "@convergent/arc/contracts/EthPolynomialCurvedToken.sol";

contract PersonalEconomy is EthPolynomialCurvedToken {
    constructor(
        string _name,
        string _symbol,
        string _action1,
        string _action2,
        string _action3,
        uint256[] _prices
    )   EthPolynomialCurvedToken(
        _name,
        _symbol,
        18,
        1,
        1000
    )
        public
    {}
}
