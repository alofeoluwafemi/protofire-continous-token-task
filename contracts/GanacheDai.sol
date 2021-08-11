// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GanacheDai is Ownable, ERC20 {
    constructor(address[] memory _addresses)
        ERC20("Ganache Dai Token", "GDai")
    {
        for (uint256 i = 0; i < _addresses.length; i++) {
            _mint(_addresses[i], 500 ether);
        }
    }
}
