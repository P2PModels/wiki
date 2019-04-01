/* global artifacts */
var WikiApp = artifacts.require('CounterApp.sol')

module.exports = function(deployer) {
  deployer.deploy(WikiApp)
}
