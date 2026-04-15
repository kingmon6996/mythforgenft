// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/access/Ownable.sol";

contract MythForgeNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    mapping(uint256 => address)   public creators;
    mapping(uint256 => string[])  public loreEntries;
    mapping(uint256 => uint256[]) public interactions;

    constructor() ERC721("MythForgeNFT", "MYTH") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    // ── Internal existence check ─────────────────────────────────────────────
    function _requireExists(uint256 tokenId) internal view {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
    }

    // ── Mint ─────────────────────────────────────────────────────────────────
    function mintMyth(string memory tokenURI) external returns (uint256) {
        tokenCounter++;
        uint256 tokenId = tokenCounter;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        creators[tokenId] = msg.sender;

        return tokenId;
    }

    // ── Lore ─────────────────────────────────────────────────────────────────
    function addLore(uint256 tokenId, string memory loreText) external {
        _requireExists(tokenId);
        loreEntries[tokenId].push(loreText);
    }

    function getLore(uint256 tokenId) external view returns (string[] memory) {
        _requireExists(tokenId);
        return loreEntries[tokenId];
    }

    // ── Interactions ─────────────────────────────────────────────────────────
    function interact(uint256 fromTokenId, uint256 toTokenId) external {
        _requireExists(fromTokenId);
        _requireExists(toTokenId);
        require(fromTokenId != toTokenId, "Cannot interact with self");
        interactions[fromTokenId].push(toTokenId);
    }

    function getInteractions(uint256 tokenId) external view returns (uint256[] memory) {
        _requireExists(tokenId);
        return interactions[tokenId];
    }
}