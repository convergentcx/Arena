const PersonalEconomyFactory = artifacts.require('./PersonalEconomyFactory.sol')

module.exports = function(deployer) {
    deployer.deploy(PersonalEconomyFactory)
}
