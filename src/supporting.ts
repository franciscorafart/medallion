// The Ethereum zero address
export const ZeroAddress = "0x0000000000000000000000000000000000000000";

// Simplified ERC-721 Non-Fungible Token Standard
// Comments are adapted for this exercise from the official spec
// @see https://eips.ethereum.org/EIPS/eip-721
export interface NFT {
  /// @notice Count all NFTs assigned to an owner
  /// @dev Throws for queries about the zero address.
  /// @param owner An address for whom to query the balance
  /// @return The number of NFTs owned by `owner`, possibly zero
  balanceOf: (owner: string) => number;

  /// @notice Find the owner of an NFT
  /// @dev Throws if `tokenId` is not a valid NFT.
  /// @param tokenId The identifier for an NFT
  /// @return The address of the owner of the NFT
  ownerOf: (tokenId: number) => string;

  /// @notice Transfer ownership of an NFT
  /// @dev Throws unless `sender` is the current owner. Throws if `from` is
  ///  not the current owner. Throws if `to` is the zero address. Throws if
  ///  `tokenId` is not a valid NFT.
  /// @param sender The sender of the transfer request
  /// @param from The current owner of the NFT
  /// @param to The new owner
  /// @param tokenId The NFT to transfer
  transferFrom: (
    sender: string,
    from: string,
    to: string,
    tokenId: number
  ) => void;
}

export type Data = Map<string, number[]>

// NFT holder definition, used in create function only
export type NFTHolder = [string, number];

// NFT creation interface for the purpose of this exercise
export type NFTCreateFn = (holders?: NFTHolder[]) => NFT;
