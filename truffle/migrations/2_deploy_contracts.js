const PayrollSystem = artifacts.require("PayrollSystem");

module.exports = function(deployer) {
  deployer.deploy(PayrollSystem);
};