pragma solidity ^0.4.24;

import "@convergent/arc/contracts/EthPolynomialCurvedToken.sol";

contract PersonalEconomy is EthPolynomialCurvedToken {
    event Requested(string message, uint256 time);

    bytes32 public mhash;
    
    constructor(
        bytes32 _mhash,
        string _name,
        string _symbol
    )   EthPolynomialCurvedToken(
        _name,
        _symbol,
        18,
        1,
        1000
    )
        public
    {
        mhash = _mhash;
    }

    function requestWithEth(
        string _msg,
        uint256 _price
    )   public
        payable
    {}

    function requestWithToken(string _msg) {}
}
