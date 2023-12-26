import { Data, NFT, NFTCreateFn, NFTHolder } from "./supporting";// const owners: NFTHolder[] = [["0xAB…CD", 2], …, ["0x12…34", 1]];

// The Ethereum zero address
export const ZeroAddress = "0x0000000000000000000000000000000000000000";

const createFn: NFTCreateFn = (holders?: NFTHolder[]) => {
 class NewNFT implements NFT {
    private data: Data; // store assets by address
    private walletAddressByNft: Map<string, string>;
    private currentIdx: number;

    constructor() {
      this.data = new Map<string, number[]>();
      this.walletAddressByNft = new Map<string, string>();
      this.currentIdx = 0;

      if (holders) {
        for (const [address, balance] of holders) {
          const sequence = Array.from(
            { length: balance },
            (_, idx) => this.currentIdx + idx
          );

          const currentSequence = this.data.get(address) || [];
          this.data.set(address, [...currentSequence, ...sequence]);

          // update walletAddressByNft
          for (const el of sequence){
            this.walletAddressByNft.set(String(el), address)
          }

          this.currentIdx += balance;
        }
      }
    }
    balanceOf(ownerId: string): number {
        if (ownerId === ZeroAddress) {
            throw "Can't query for Zero Address"
        }

        if (typeof ownerId !== 'string' || ownerId === undefined) { // check non-string or empty string
            throw 'Invalid owner Id'
        }

        return this.data.get(ownerId)?.length || 0
    }
    
    ownerOf(nftId: number): string {
        const numEntries = this.data.size;
        if (numEntries === 0 || !Number.isInteger(nftId) || nftId < 0 || nftId >= this.currentIdx){ // check positive integers
            throw 'Invalid NFT id'
        }

        return this.walletAddressByNft.get(String(nftId)) || '';
    }

    transferFrom(
        sender: string,
        from: string,
        to: string,
        tokenId: number,
    ): void {
        // Checks
        const currentOwner = this.ownerOf(tokenId); 
        if (sender !== currentOwner || from !== currentOwner) {
            throw `Address not allowed to transfer asset ${tokenId}`
        }

        if (to === ZeroAddress) {
            throw "Can't send assets to Zero Address"
        }

        // Swap asset
        const ownerAssets = this.data.get(currentOwner);
        const receiverAssets = this.data.get(to) || [];

        const indexOfAsset = ownerAssets?.indexOf(tokenId);
        if (ownerAssets && indexOfAsset !== undefined && indexOfAsset >= 0){

            ownerAssets.splice(indexOfAsset, 1); // Remove in-place
            
            receiverAssets.push(tokenId)
            
            // Set data
            this.data.set(currentOwner, ownerAssets)
            this.data.set(to, receiverAssets)

            this.walletAddressByNft.set(String(tokenId), to);
        }
    }
 } 

 return new NewNFT;
}



export default createFn;
