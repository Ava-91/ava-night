// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract Counter {
    uint256 public count;
    event CountChanged(uint256 value);
    function increment() external {
        count += 1;
        emit CountChanged(count);
    }
}
