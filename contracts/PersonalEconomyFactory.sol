pragma solidity ^0.4.24;

import "./Factory.sol";
import "./PersonalEconomy.sol";

contract PersonalEconomyFactory is Factory {

    event Created(address token_address, address indexed owner_address, uint256 time, string name);

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
        tokenAddress = new PersonalEconomy(
            _name,
            _symbol,
            _action1,
            _action2,
            _action3,
            _prices
        
        );
        
        register(tokenAddress);
        emit Created(tokenAddress, msg.sender, now, _name);
    }
}
