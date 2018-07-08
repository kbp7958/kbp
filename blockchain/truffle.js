var Web3 = require('web3');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    node: {
      provider: () => {
        return new Web3.providers.HttpProvider('https://u0iln8goff-u0ecf65rur-rpc.us-east-2.kaleido.io', 0, 'u0fcafyhlo', '472NVgebspcwhdqiGQIUAgRU4HpA1LmxyY5DzOr0SYk');
      },
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 4500000
    }
  }
};
