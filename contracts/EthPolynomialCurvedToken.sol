/*pragma solidity ^0.4.23*/

import "./EthBondingCurvedToken.sol";


/// @title  EthPolynomialCurvedToken - A polynomial bonding curve
///         implementation that is backed by ether.
contract EthPolynomialCurvedToken is EthBondingCurvedToken {

    event Requested(string message);

    // uint256 constant private PRECISION = 10000000000;
    string public name;
    string public symbol;
    address public owner;
    string public action1;
    string public action2;
    string public action3;
    uint[] public prices;
    uint8 public exponent = 1;
    uint32 public invSlope = 1000;
    uint8 public decimals = 18;
    //bool initalized = false;

    //@dev constructor        Initializes the bonding curve
    constructor(string _name, string _symbol, address _owner, string _action1, string _action2, string _action3, uint[] _prices) public {
        name = _name;
        symbol = _symbol;
        owner = _owner;
        action1 = _action1;
        action2 = _action2;
        action3 = _action3;
        prices = _prices;
    }

    // @dev initContract        Initializes the bonding curve
    // need to make sure this function is only called once
    // @param _name             The name of the token
    // @param _decimals         The number of decimals to use
    // @param _symbol           The symbol of the token
    // @param _exponent         The exponent of the curve
    // @param _hash             digest produced by hashing content using hash function
    // @param _hashFunction     code for the hash function used
    // @param _size             length of the digest

    // fixed above for testing

    // function initContract(
    //     string _name,
    //     uint8 _decimals,
    //     string _symbol,
    //     uint8 _exponent,
    //     uint32 _slope
    // ) public payable {
    //     require(!initalized);
    //     // extra precautions
    //     require(poolBalance == 0 && totalSupply_ == 0);
    //     initalized = false;
    //     name = _name;
    //     decimals = _decimals;
    //     symbol = _symbol;
    //     exponent = _exponent;
    //     slope = _slope;
    // }

    /// @dev        Calculate the integral from 0 to t
    /// @param t    The number to integrate to
    function curveIntegral(uint256 t) internal returns (uint256) {
        uint256 nexp = exponent + 1;
        return (t ** nexp).div(nexp).div(invSlope).div((10 ** (uint256(decimals) * uint256(exponent))));
    }

    function priceToMint(uint256 numTokens) view public returns(uint256) {
        return curveIntegral(totalSupply_.add(numTokens)).sub(poolBalance);
    }

    function rewardForBurn(uint256 numTokens) public returns(uint256) {
        return poolBalance.sub(curveIntegral(totalSupply_.sub(numTokens)));
    }

    function requestWithEth(string message, uint256 numTokens) public payable {
        mint(numTokens);
        balances[msg.sender] -= numTokens;
        balances[owner] += numTokens;
        emit Requested(message);
    }

    function requestWithToken(string message) public {
        require(balances[msg.sender] >= prices[0]*10 ** (uint256(decimals)));
        balances[msg.sender] -= prices[0]*(uint256(decimals));
        balances[owner] += prices[0]*(uint256(decimals));
        emit Requested(message);
    }
}
