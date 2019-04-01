pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";


contract WikiApp is AragonApp {

    /// Events
    event Edit(address indexed entity, bytes32 page, bytes value);
    event Create(address indexed entity, bytes32 page, bytes value);
    event Remove(address indexed entity, bytes32 page);
    event ChangePermissions(address indexed entity, bytes32 page, bool isProtected);

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

    function initialize() public onlyInit {
        initialized();
    }

    /**
     * @notice Edit the "`@fromHex(pageName)`" wiki page
     * @param pageName Name of the page to be edited
     * @param value New hash of the page
     */
    function edit(bytes32 pageName, bytes value) external auth(EDIT_ROLE) {
        require(pages[pageName].flag != PROTECT_ROLE, "Page is protected");
        pages[pageName].value = value;
        emit Edit(msg.sender, pageName, value);
    }

    /**
     * @notice Create a "`@fromHex(pageName)`" wiki page
     * @param pageName Name of the page to be created
     * @param value Initial content of the page
     */
    function create(bytes32 pageName, bytes value) external auth(CREATE_ROLE) {
        pages[pageName] = PageStruct(value, EDIT_ROLE);
        emit Create(msg.sender, pageName, value);
    }

    /**
     * @notice Edit "`@fromHex(pageName)`" protected wiki page
     * @param pageName Name of the page to be created
     * @param value Initial content of the page
     */
    function editProtected(bytes32 pageName, bytes value) external auth(PROTECT_ROLE) {
        pages[pageName].value = value;
        emit Edit(msg.sender, pageName, value);
    }

    /**
     * @notice Remove the "`@fromHex(pageName)`" wiki page
     * @param pageName Name of the page to be removed
     */
    function remove(bytes32 pageName) external auth(CREATE_ROLE) {
        require(pages[pageName].flag != PROTECT_ROLE, "Page is protected");
        delete pages[pageName];
        emit Remove(msg.sender, pageName);
    }

    /**
     * @notice Protect the "`@fromHex(pageName)`" wiki page
     * @param pageName Page to be protected
     */
    function protect(bytes32 pageName) external auth(PROTECT_ROLE) {
        pages[pageName].flag = PROTECT_ROLE;
        emit ChangePermissions(msg.sender, pageName, true);
    }

    /**
     * @notice Unprotect the "`@fromHex(pageName)`" wiki page
     * @param pageName Page to be unprotected
     */
    function unprotect(bytes32 pageName) external auth(PROTECT_ROLE) {
        pages[pageName].flag = EDIT_ROLE;
        emit ChangePermissions(msg.sender, pageName, false);
    }
}
