pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";

contract WikiApp is AragonApp {

    /// Events
    event Edit(address indexed entity, bytes newValue);
    event Decrement(address indexed entity, uint256 step);

    /// State
    bytes public value;

    /// ACL
    bytes32 constant public EDIT_ROLE = keccak256("EDIT_ROLE");
    bytes32 constant public DECREMENT_ROLE = keccak256("DECREMENT_ROLE");

    function initialize() onlyInit public {
        initialized();
    }

    /**
     * @notice Edit the wiki text
     * @param newValue New hash of the text
     */
    function edit(bytes newValue) auth(EDIT_ROLE) external {
        value = newValue;
        emit Edit(msg.sender, newValue);
    }

    /**
     * @notice Decrement the counter by `step`
     * @param step Amount to decrement by
     */
    function decrement(uint256 step) auth(DECREMENT_ROLE) external {
        emit Decrement(msg.sender, step);
    }
}
