/* global artifacts */
var WikiApp = artifacts.require('WikiApp.sol')

module.exports = function(deployer) {
  deployer.deploy(WikiApp)
}
