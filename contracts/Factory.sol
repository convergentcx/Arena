pragma solidity ^0.4.21;

contract Factory {

    /*
     *  Events
     */
    event ContractInstantiation(address sender, address instantiation);

    /*
     *  Storage
     */
    mapping(address => bool) public isInstantiation;
    address[] public instantiations;

    /*
     * Public functions
     */
    // Get list of instantiations:

    function getInstantiations () public view returns (address[]){
        return instantiations;
    }
    /*
     * Internal functions
     */
    /// @dev Registers contract in factory registry.
    /// @param instantiation Address of contract instantiation.
    function register(address instantiation)
        internal
    {
        isInstantiation[instantiation] = true;
        instantiations.push(instantiation);
        emit ContractInstantiation(msg.sender, instantiation);
    }

    
}
