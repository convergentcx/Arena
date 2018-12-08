pragma solidity ^0.4.24;

import "@convergent/arc/contracts/EthPolynomialCurvedToken.sol";

contract PersonalEconomy is EthPolynomialCurvedToken {
    event Requested(string message, uint256 time, address who);

    bytes32 public mhash;
    address public owner;
    
    constructor(
        bytes32 _mhash,
        string _name,
        string _symbol,
        address _owner
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
        owner = _owner;
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

    function updateData(bytes32 _mhash)
        public returns (bool)
    {
        require(msg.sender == owner);
        mhash = _mhash;
    }
}
