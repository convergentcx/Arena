pragma solidity ^0.4.24;

import "@convergent/arc/contracts/EthPolynomialCurvedToken.sol";

contract PersonalEconomy is EthPolynomialCurvedToken {
    event Requested(string message, uint256 time, address who);

    string public name;
    string public symbol;
    address public owner;
    string public action1;
    string public action2;
    string public action3;
    uint[] public prices;
    
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
    {
        emit Requested(_msg, now, msg.sender);
    }

    function requestWithToken(string _msg) public {
        emit Requested(_msg, now, msg.sender);
    }

}
