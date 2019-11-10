# TRC20-Coin-Starter

This is a starter repository for creating your own, custom TRC20 compatible token on the TRON blockchain.
It already contains the base implementation of a TRC20, expressed in the interface: 
[contracts/TRC20able.sol](https://github.com/cookie-coin/TRC20-Coin-Starter/blob/master/contracts/TRC20able.sol)
and implemented in the abstract contract: 
[contracts/BaseCoin.sol](https://github.com/cookie-coin/TRC20-Coin-Starter/blob/master/contracts/BaseCoin.sol)


## Getting Started

### Setup
First you need to set up your development environment by installing the tron-box: [how to set up tronbox](https://developers.tron.network/docs/tron-box-user-guide)
Then you need a local tron node running. Ideally you can do this with the [docker-tron-quickstart](https://github.com/TRON-US/docker-tron-quickstart)
After that you can just use your favorite IDE to start developing (e.g. Visual Studio Code or IntelliJ IDEA).

The main contract for your token is [MyCoin.sol](https://github.com/cookie-coin/TRC20-Coin-Starter/blob/master/contracts/MyCoin.sol)
For the unit-tests there is already a class with complete tests that should cover the basic implementation 
and can be extended with the needs of your custom implementation: [CookieCoin.test.js](https://github.com/cookie-coin/cookie-coin/blob/master/test/CookieCoin.test.js).

For using tronbox to compile, migrate, deploy and run tests please check out [tron-box-contract-deployment](https://developers.tron.network/docs/tron-box-contract-deployment)

## Authors
* **Florian Mitterbauer** - *Initial work* - [daflockinger](https://github.com/daflockinger)

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/daflockinger/unitstack/blob/master/LICENSE) file for details

