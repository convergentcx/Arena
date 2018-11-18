pragma solidity ^0.4.21;

import "./Factory.sol";
import "./EthPolynomialCurvedToken.sol";

/// @title MyToken Factory - Allows creation of custom token.
/// @author Nicolas frega - <nicolas.frega@srax.com>

contract MyTokenFactory is Factory {

    event Created(address indexed token_address, address indexed owner_address);

    /*
     * Public functions
     */
    /// @dev Allows verified creation of custom token.
    /// @param _name String for token name.
    /// @param _symbol String for token symbol.
    /// @return Returns token address.
    function create(string _name, string _symbol, string _action1, string _action2, string _action3, uint[] _prices)
        public
        returns (address tokenAddress)
    {
        tokenAddress = new EthPolynomialCurvedToken(_name, _symbol, msg.sender, _action1, _action2, _action3, _prices);
        register(tokenAddress);
        emit Created(tokenAddress, msg.sender);

    }
}
