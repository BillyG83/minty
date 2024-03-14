// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721, ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MintyNFT is ERC721Enumerable, Ownable {
    // if users address is on list, return rtue
    mapping(address => bool) private _approvedMinters;

    // Thanks ERC721 for doing all this work
    constructor() ERC721("MintyNFT", "MNFT") Ownable(msg.sender) {}

    // protect mint function to only approved addressed added by owner
    modifier isApprovedList() {
        require(_approvedMinters[msg.sender], "Address not on ApprovedList");
        _;
    }

    // safeMint from ERC721Enumerable is callable if the users address is on the approved list
    function mint(address _to, uint256 _tokenId) external isApprovedList {
        _safeMint(_to, _tokenId);
    }

    // a public function that would allow a user to see if their address on on the approved list
    function isAddressApproved(address _address) external view returns (bool) {
        return _approvedMinters[_address];
    }

    // the contract owner can add users addresses to the approved list
    function addToApprovedList(address _address) external onlyOwner {
        _approvedMinters[_address] = true;
    }

    // the contract owner can remove users addresses to the approved list #rug (╯°□°)╯︵ ┻━┻
    function removeFromApprovedList(address _address) external onlyOwner {
        _approvedMinters[_address] = false;
    }
}
