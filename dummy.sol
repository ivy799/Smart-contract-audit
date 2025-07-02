// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DummyContract {
    string public name;
    uint public count;

    constructor(string memory _name) {
        name = _name;
        count = 0;
    }

    function increment() public {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}
