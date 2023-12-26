import { beforeEach, describe } from "mocha";
import { expect } from "chai";
import { ZeroAddress, NFT, NFTHolder } from "./supporting";
import createFn from "./nft";

const TEST_ACCOUNTS: string[] = [
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
];
const TEST_TOKEN_IDS = [0, 1, 1337, 999999];

describe("Medallion TypeScript exercise", () => {
  it("should export a create function", () => {
    expect(typeof createFn).to.equal("function");
    expect(createFn).not.to.be.null;
  });

  describe("creating an NFT with no holders", () => {
    let acc1: string;
    let acc2: string;
    let nft: NFT;
    beforeEach(() => {
      nft = createFn();
      [acc1, acc2] = TEST_ACCOUNTS;
    });

    it("should throw an error for token related requests", () => {
      TEST_TOKEN_IDS.forEach((tokenId) => {
        expect(() => nft.ownerOf(tokenId)).to.throw();
        expect(() => nft.transferFrom(acc1, acc1, acc2, tokenId)).to.throw();
      });
    });

    it("should return zero balance for all accounts", () => {
      TEST_ACCOUNTS.forEach((account) => {
        expect(nft.balanceOf(account)).to.equal(0);
      });
    });
  });

  describe("creating an NFT with valid holders", () => {
    let acc1: string;
    let acc2: string;
    let acc3: string;
    let nft1: NFT;
    let nft2: NFT;
    beforeEach(() => {
      [acc1, acc2, acc3] = TEST_ACCOUNTS;
      nft1 = createFn([
        [acc1, 1],
        [acc2, 2],
        [acc3, 1],
      ]);
      nft2 = createFn([
        [acc1, 100],
        [acc2, 23],
        [acc3, 962],
      ]);
    });

    it("should return the correct balances", () => {
      expect(nft1.balanceOf(acc1)).to.equal(1);
      expect(nft1.balanceOf(acc2)).to.equal(2);
      expect(nft1.balanceOf(acc3)).to.equal(1);
      expect(nft2.balanceOf(acc1)).to.equal(100);
      expect(nft2.balanceOf(acc2)).to.equal(23);
      expect(nft2.balanceOf(acc3)).to.equal(962);
    });

    it("should allocate sequential zero-indexed token Ids", () => {
      expect(nft1.ownerOf(0)).to.equal(acc1);
      expect(nft1.ownerOf(1)).to.equal(acc2);
      expect(nft1.ownerOf(2)).to.equal(acc2);
      expect(nft1.ownerOf(3)).to.equal(acc3);
      expect(nft2.ownerOf(0)).to.equal(acc1);
      expect(nft2.ownerOf(120)).to.equal(acc2);
      expect(nft2.ownerOf(300)).to.equal(acc3);
      expect(nft2.ownerOf(600)).to.equal(acc3);
    });
  });

  describe("NFT transfers", () => {
    let acc1: string;
    let acc2: string;
    let acc3: string;
    let nft: NFT;
    beforeEach(() => {
      [acc1, acc2, acc3] = TEST_ACCOUNTS;
      nft = createFn([
        [acc1, 1],
        [acc2, 2],
        [acc3, 1],
      ]);
    });

    it("should allow the token holder to transfer their tokens", () => {
      expect(() => nft.transferFrom(acc1, acc1, acc2, 0)).not.to.throw();
    });

    it("should throw trying to transfer another holder's tokens", () => {
      expect(() => nft.transferFrom(acc1, acc2, acc1, 1)).to.throw();
    });

    it("should track balances and ownership through transfers", () => {
      nft.transferFrom(acc1, acc1, acc2, 0);
      expect(nft.ownerOf(0)).to.equal(acc2);
      expect(nft.balanceOf(acc1)).to.equal(0);
      expect(nft.balanceOf(acc2)).to.equal(3);
      expect(() => nft.transferFrom(acc1, acc2, acc1, 0)).to.throw();
      expect(() => nft.transferFrom(acc1, acc1, acc2, 0)).to.throw();

      nft.transferFrom(acc2, acc2, acc3, 1);
      expect(nft.ownerOf(1)).to.equal(acc3);
      expect(nft.balanceOf(acc2)).to.equal(2);
      expect(nft.balanceOf(acc3)).to.equal(2);
      expect(() => nft.transferFrom(acc2, acc3, acc2, 1)).to.throw();
      expect(() => nft.transferFrom(acc2, acc2, acc3, 1)).to.throw();

      nft.transferFrom(acc3, acc3, acc1, 3);
      expect(nft.ownerOf(3)).to.equal(acc1);
      expect(nft.balanceOf(acc1)).to.equal(1);
      expect(nft.balanceOf(acc3)).to.equal(1);
      expect(() => nft.transferFrom(acc3, acc1, acc3, 3)).to.throw();
      expect(() => nft.transferFrom(acc3, acc3, acc1, 3)).to.throw();
    });
  });

  describe("handling invalid requests", () => {
    let acc1: string;
    let nft: NFT;
    beforeEach(() => {
      [acc1] = TEST_ACCOUNTS;
      nft = createFn([[acc1, 1]]);
    });

    it("balanceOf should throw for zero address", () => {
      expect(() => nft.balanceOf(ZeroAddress)).to.throw();
    });

    it("ownerOf should throw for tokens which don't exist", () => {
      expect(() => nft.ownerOf(1337)).to.throw();
    });

    it("transferFrom should throw to zero address", () => {
      expect(nft.ownerOf(0)).to.equal(acc1);
      expect(() => nft.transferFrom(acc1, acc1, ZeroAddress, 0)).to.throw();
    });
  });

  describe("interesting initializations", () => {
    it("should handle repeated owners", () => {
      const [acc1, acc2] = TEST_ACCOUNTS;
      const nft = createFn([
        [acc1, 1],
        [acc2, 2],
        [acc1, 2],
      ]);

      expect(nft.balanceOf(acc1)).to.equal(3);
      expect(nft.balanceOf(acc2)).to.equal(2);
      expect(nft.ownerOf(0)).to.equal(acc1);
      expect(nft.ownerOf(1)).to.equal(acc2);
      expect(nft.ownerOf(2)).to.equal(acc2);
      expect(nft.ownerOf(3)).to.equal(acc1);
      expect(nft.ownerOf(4)).to.equal(acc1);
    });

    it("should handle a large number of holders", () => {
      const holders: NFTHolder[] = [];
      let nextTokenId = 0;
      const tokens: Record<number, string> = {};
      const balances: Record<string, number> = {};
      for (let i = 0; i < 10000; i++) {
        const holderIdx = Math.floor(Math.random() * TEST_ACCOUNTS.length);
        const holder = TEST_ACCOUNTS[holderIdx];
        const balance = Math.floor(Math.random() * 100);
        holders.push([holder, balance]);
        balances[holder] = balances[holder] + balance || balance;
        for (let j = 0; j < balance; j++) {
          tokens[nextTokenId++] = holder;
        }
      }
      const nft = createFn(holders);

      const [acc1, acc2, acc3] = TEST_ACCOUNTS;
      expect(nft.balanceOf(acc1)).to.equal(balances[acc1]);
      expect(nft.balanceOf(acc2)).to.equal(balances[acc2]);
      expect(nft.balanceOf(acc3)).to.equal(balances[acc3]);

      expect(nft.ownerOf(9)).to.equal(tokens[9]);
      expect(nft.ownerOf(99)).to.equal(tokens[99]);
      expect(nft.ownerOf(999)).to.equal(tokens[999]);
      expect(nft.ownerOf(9999)).to.equal(tokens[9999]);
    });
  });
});
