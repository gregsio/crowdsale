# Sample ICO Project

This project demonstrates an ERC-20 token crowdsale leveraging two different contracts.

The Crowdsale contract handles the ICO.
The Token contract is the actual ERC-20

 It is using Hardhat, React and React-Boostrap and has test coverage for all solidity contract's features.

## Pre-requisites
- install all dependencies
    ```shell
    npm install
    ```
- Metamask browser extension

## Try running some of the following tasks:

- execute the test suite:

    ```shell
    npx hardhat test
    REPORT_GAS=true npx hardhat test
    ```
 - run the React website with HardHat localhost blockchain

    1/ Deploy the contracts
    ```shell
    npx hardhat node  #start HH node
    npx hardhat run scripts/deploy.js # deploy contracts
    ```

    2/ The React app can be started with

    ```shell
        npm start
    ```
    3/ Connect using Metamask
    Import HH accounts into Metamask

## Note:
- Proper Metamask login feature in the navigation bar is out of scope for this project and may be added in the future.
- Always privileges audited or trusted ERC-20 for Mainnet production deployments (see https://docs.openzeppelin.com/contracts/4.x/erc20)
- Project only tested using hardhat localhost network
