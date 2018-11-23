pragma solidity ^0.4.24;

import "@convergent/arc/contracts/EthPolynomialCurvedToken.sol";

contract PersonalEconomy is EthPolynomialCurvedToken {
    event Requested(string message, uint256 time);

    string public name;
    string public symbol;
    address public owner;
    string public action1;
    string public action2;
    string public action3;
    uint256[] public prices;
    
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
    {
        name = _name;
        symbol = _symbol;
        action1 = _action1;
        action2 = _action2;
        action3 = _action3;
        prices = _prices;
    }

    function requestWithEth(
        string _msg,
        uint256 _price
    )   public
        payable
    {}

    function requestWithToken(string _msg) {}
}
