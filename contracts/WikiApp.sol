pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";


contract WikiApp is AragonApp {

    /// Events
    event Edit(address indexed entity, bytes32 page, bytes newValue);
    event Create(address indexed entity, bytes32 page, bytes value);
    event Remove(address indexed entity, bytes32 page);
    event Protect(address indexed entity, bytes32 page);
    event Unprotect(address indexed entity, bytes32 page);

    // Types
    struct PageStruct {
        bytes value;
        bytes32 flag;
    }

    /// State
    mapping(bytes32 => PageStruct) public pages;

    /// ACL
    bytes32 constant public EDIT_ROLE = keccak256("EDIT_ROLE");
    bytes32 constant public CREATE_ROLE = keccak256("CREATE_ROLE");
    bytes32 constant public PROTECT_ROLE = keccak256("PROTECT_ROLE");

    /**
     * @notice Edit the wiki page `pageName` with `newValue`
     * @param pageName Name of the page to be edited
     * @param newValue New hash of the page
     */
    function edit(bytes32 pageName, bytes newValue) external auth(EDIT_ROLE) {
        require(pages[pageName].flag != PROTECT_ROLE, "Page is protected");
        pages[pageName].value = newValue;
        emit Edit(msg.sender, pageName, newValue);
    }

    /**
     * @notice Create page `pageName` with content `value`
     * @param pageName Name of the page to be created
     * @param value Initial content of the page
     */
    function create(bytes32 pageName, bytes value) external auth(CREATE_ROLE) {
        pages[pageName] = PageStruct(value, EDIT_ROLE);
        emit Create(msg.sender, pageName, value);
    }

    /**
     * @notice Edit protected page `pageName` with content `value`
     * @param pageName Name of the page to be created
     * @param value Initial content of the page
     */
    function editProtected(bytes32 pageName, bytes value) external auth(CREATE_ROLE) {
        pages[pageName].value = value;
        emit Edit(msg.sender, pageName, value);
    }

    /**
     * @notice Remove page `pageName`
     * @param pageName Name of the page to be removed
     */
    function remove(bytes32 pageName) external auth(CREATE_ROLE) {
        delete pages[pageName];
        emit Remove(msg.sender, pageName);
    }

    /**
     * @notice Protect the page `pageName`
     * @param pageName Page to be protected
     */
    function protect(bytes32 pageName) external auth(PROTECT_ROLE) {
        pages[pageName].flag = PROTECT_ROLE;
        emit Protect(msg.sender, pageName);
    }

    /**
     * @notice Unprotect the page `pageName`
     * @param pageName Page to be unprotected
     */
    function unprotect(bytes32 pageName) external auth(PROTECT_ROLE) {
        pages[pageName].flag = EDIT_ROLE;
        emit Unprotect(msg.sender, pageName);
    }

    function initialize() public onlyInit {
        initialized();
    }
}
