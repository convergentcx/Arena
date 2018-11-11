
// import "tokens/eip20/EIP20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";


/// @title  EthBondingCurvedToken - A bonding curve
///         implementation that is backed by ether.
contract EthBondingCurvedToken is StandardToken {

    event Minted(uint256 amount, uint256 totalCost);
    event Burned(uint256 amount, uint256 reward);

    using SafeMath for uint256;

    uint256 public poolBalance;

    /// @dev constructor    Initializes the bonding curve
    /// @param name         The name of the token
    /// @param decimals     The number of decimals to use
    /// @param symbol       The symbol of the token
    // constructor(
    //     string _name,
    //     uint8 _decimals,
    //     string _symbol
    // ) public {
    //     name = _name;
    //     decimals = _decimals;
    //     symobo
    // }

    /// @dev                Get the price in ether to mint tokens
    /// @param numTokens    The number of tokens to calculate price for
    function priceToMint(uint256 numTokens) public returns(uint256);

    /// @dev                Get the reward in ether to burn tokens
    /// @param numTokens    The number of tokens to calculate reward for
    function rewardForBurn(uint256 numTokens) public returns(uint256);

    /// @dev                Mint new tokens with ether
    /// @param numTokens    The number of tokens you want to mint
    function mint(uint256 numTokens) public payable {
        uint256 priceForTokens = priceToMint(numTokens);
        require(msg.value >= priceForTokens);

        totalSupply_ = totalSupply_.add(numTokens);
        balances[msg.sender] = balances[msg.sender].add(numTokens);
        poolBalance = poolBalance.add(priceForTokens);
        if (msg.value > priceForTokens) {
            msg.sender.transfer(msg.value - priceForTokens);
        }

        emit Minted(numTokens, priceForTokens);
    }

    /// @dev                Burn tokens to receive ether
    /// @param numTokens    The number of tokens that you want to burn
    function burn(uint256 numTokens) public {
        require(balances[msg.sender] >= numTokens);

        uint256 ethToReturn = rewardForBurn(numTokens);
        totalSupply_ = totalSupply_.sub(numTokens);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        poolBalance = poolBalance.sub(ethToReturn);
        msg.sender.transfer(ethToReturn);

        emit Burned(numTokens, ethToReturn);
    }
}
