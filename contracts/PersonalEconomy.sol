pragma solidity ^0.4.24;

import "@convergent/arc/contracts/Spreads/SpreadEther.sol";

contract PersonalEconomy is SpreadEther {
    event Requested(string message, uint256 time, address who);

    bytes32 public mhash;
    
    constructor(
        bytes32 _mhash,
        string _name,
        string _symbol,
        address _owner
    )   public
    {
        SpreadEther.initialize(
            _name,
            _symbol,
            18,
            1,
            1,
            3000,
            4000
        );
        transferOwnership(_owner);
        mhash = _mhash;
    }

    function requestWithEth(
        string message,
        uint256 reqNumTokens
    )   public
        payable
    {
        uint256 cost = price(reqNumTokens);
        require(msg.value >= cost, "Must send requisite amount to purchase.");

        _mint(msg.sender, reqNumTokens);
        _transfer(msg.sender, owner(), reqNumTokens);
        emit Requested(message, now, msg.sender);
    }

    function requestWithToken(string message, uint256 reqNumTokens) public {
        _transfer(msg.sender, owner(), reqNumTokens);
        emit Requested(message, now, msg.sender);
    }

    function updateData(bytes32 _mhash)
        public returns (bool)
    {
        require(msg.sender == owner());
        mhash = _mhash;
    }
}
