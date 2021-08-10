## Requirements

You must have the following installed on your Machine to run this code:

- Solidity compiler
- Metamask chrome or Firefox plugin
- NPM
- Truffle

## Setup Process

First clone this repository `git clone https://github.com/slim12kg/protofire-continous-token-task.git`

cd into the cloned project folder on your terminal from your machine

Run `npm install`

Request 7.5 Ethers from the rinkeby faucet https://faucet.rinkeby.io/ from your metamask wallet

Visit https://app.compound.finance/ to borrow atleast 500 Dai with your test Ether from your metamask wallet

Add Dai token to your metamask wallet using this contract address `0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea`

Spread 1 Ether each to the first 3 addresses on your Metamask wallet, and 250 Dai each also.

Get an Infura API key if don't have one from https://infura.io/

Copy `secret.example.json` to `secret.json` and replace the details with yours

Run `truffle console --network rinkeby`

Run `test test/linear_curve_test.js` for Linear Bond Curve Token

Run `test test/exponential_curve_test.js` for Exponential Bond Curve Token

## References

- https://yos.io/2018/11/10/bonding-curves/
- https://github.com/bancorprotocol/

## Any Questions

You can reach out to me via the follwing medium

- Email <oluwafemialofe@yahoo.com>
- Telegram <@DreWhyte>
