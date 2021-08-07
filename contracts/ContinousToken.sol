// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./curves/BancorFormula.sol";

contract ContinousToken is BancorFormula, Ownable, ERC20 {
    using SafeMath for uint256;

    uint256 public scale = 10**18;
    uint256 public reserveBalance = 10 * scale;
    uint256 public reserveRatio;
    address public reserveTokenAddress;

    event ContinuousBurn(
        address _address,
        uint256 continuousTokenAmount,
        uint256 reserveTokenAmount
    );

    event ContinuousMint(
        address _address,
        uint256 reserveTokenAmount,
        uint256 continuousTokenAmount
    );

    constructor(uint256 _reserveRatio, address _reserveTokenAddress)
        ERC20("Continous Token", "TOK")
    {
        reserveRatio = _reserveRatio;
        reserveTokenAddress = _reserveTokenAddress;
        _mint(msg.sender, 1 * scale);
    }

    function mint() public payable {
        require(msg.value > 0, "Must send DAI to buy tokens.");
        _continuousMint(msg.value);
    }

    function burn(uint256 _amount) public {
        uint256 returnAmount = _continuousBurn(_amount);
        IERC20(reserveTokenAddress).transfer(msg.sender, returnAmount);
    }

    receive() external payable {
        mint();
    }

    function calculateContinuousMintReturn(uint256 _amount)
        public
        view
        returns (uint256 mintAmount)
    {
        return
            purchaseTargetAmount(
                totalSupply(),
                reserveBalance,
                uint32(reserveRatio),
                _amount
            );
    }

    function calculateContinuousBurnReturn(uint256 _amount)
        public
        view
        returns (uint256 burnAmount)
    {
        return
            saleTargetAmount(
                totalSupply(),
                reserveBalance,
                uint32(reserveRatio),
                _amount
            );
    }

    function _continuousMint(uint256 _deposit) internal returns (uint256) {
        require(_deposit > 0, "Deposit must be non-zero.");

        uint256 amount = calculateContinuousMintReturn(_deposit);
        _mint(msg.sender, amount);
        reserveBalance = reserveBalance.add(_deposit);

        emit ContinuousMint(msg.sender, amount, _deposit);

        return amount;
    }

    function _continuousBurn(uint256 _amount) internal returns (uint256) {
        require(_amount > 0, "Amount must be non-zero.");
        require(
            balanceOf(msg.sender) >= _amount,
            "Insufficient tokens to burn."
        );

        uint256 reimburseAmount = calculateContinuousBurnReturn(_amount);
        _burn(msg.sender, _amount);
        reserveBalance = reserveBalance.sub(reimburseAmount);

        emit ContinuousBurn(msg.sender, _amount, reimburseAmount);

        return reimburseAmount;
    }
}
