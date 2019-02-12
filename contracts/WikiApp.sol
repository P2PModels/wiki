pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";

contract WikiApp is AragonApp {

    /// Events
    event Edit(address indexed entity, bytes32 page, bytes newValue);
    event Create(address indexed entity, bytes32 page, bytes value);
    event Delete(address indexed entity, bytes32 page);
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

    function initialize() onlyInit public {
        initialized();
    }

    /**
     * @notice Edit the wiki page `pageName` with `newValue`
     * @param pageName Name of the page to be edited
     * @param newValue New hash of the page
     */
    function edit(bytes32 pageName, bytes newValue) auth(EDIT_ROLE) external {
        require(pages[pageName].flag != PROTECT_ROLE);
        pages[pageName].value = newValue;
        emit Edit(msg.sender, pageName, newValue);
    }

    /**
     * @notice Create page `pageName` with content `value`
     * @param pageName Name of the page to be created
     * @param value Initial content of the page
     */
    function create(bytes32 pageName, bytes value) auth(CREATE_ROLE) external {
        pages[pageName] = PageStruct(value, EDIT_ROLE);
        emit Create(msg.sender, pageName, value);
    }

    /**
     * @notice Edit protected page `pageName` with content `value`
     * @param pageName Name of the page to be created
     * @param value Initial content of the page
     */
    function editProtected(bytes32 pageName, bytes value) auth(CREATE_ROLE) external {
        pages[pageName].value = value;
        emit Edit(msg.sender, pageName, value);
    }

    /**
     * @notice Delete page `pageName`
     * @param pageName Name of the page to be deleted
     */
    function deletePage(bytes32 pageName) auth(CREATE_ROLE) external {
        delete pages[pageName];
        emit Delete(msg.sender, pageName);
    }

    /**
     * @notice Protect the page `pageName`
     * @param pageName Page to be protected
     */
    function protect(bytes32 pageName) auth(PROTECT_ROLE) external {
        pages[pageName].flag = PROTECT_ROLE;
        emit Protect(msg.sender, pageName);
    }

    /**
     * @notice Unprotect the page `pageName`
     * @param pageName Page to be unprotected
     */
    function unprotect(bytes32 pageName) auth(PROTECT_ROLE) external {
        pages[pageName].flag = EDIT_ROLE;
        emit Unprotect(msg.sender, pageName);
    }
}
