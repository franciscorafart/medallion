## TypeScript NFT exercise

_A brief exercise to create an NFT-like object in TypeScript (or JavaScript)._

## Motivation

This exercise is designed to allow you to show in under an hour:

- you write readable, maintainable code
- you can implement a simply specified system
- you're comfortable with typed code (optional)

If you're new to Blockchain and NFTs, you might find it interesting!

## In a hurry

- Clone this repository
- Install the dependencies `npm install`<sup>[1]</sup>
- Create a new file `src/nft.ts`<sup>[2]</sup>
- Export a default function of type `NFTCreateFn`
- Implement necessary interfaces & types in `src/supporting.ts`
- Run the tests to verify your solution `npm test`<sup>[3]</sup>
- Email your solution to careers@medallion.fm

## The problem

At a basic level, the Ethereum NFT (ERC721) spec allows tracking ownership of
distinguishable assets. Each owner is represented by a string address, and each
asset by a unique integer.

To complete this exercise you'll create a TypeScript object (or class) which
keeps track of assets and their owners, implementing the following methods:

- `balanceOf` returns the number of assets held by an owner
- `ownerOf` returns the owner of a specific asset
- `transferFrom` transfers an asset from one owner to another

Your solution should take the form of a function which accepts a list of owners
and balances to initialise the assets (with sequential, zero-indexed, integer
identifiers) and returns an object implementing these methods.

```
const owners: NFTHolder[] = [["0xAB…CD", 2], …, ["0x12…34", 1]];
```

**We'll check your submission against the provided test suite, which is based
on the comments found in `src/supporting.ts`. However, we're looking for a
good approach to the problem, not a perfect solution.**

## Submitting

Please send your solution to careers@medallion.fm in whatever form you prefer,
just do you best to make it easy for us to access, and parse (no JPEGs!)

## Supporting files

While you only need to submit a single `.ts` (or `.js`) file, we've provided
a basic development environment help make things easier:

- `src/supporting.ts` predefined types and interfaces
- `src/nft.spec.ts` a test suite for the exercise
- `.mocharc.json` configuration for running tests
- `package.json, package-lock.json` development dependencies
- `tsconfig.json` TypeScript configuration for the exercise
- `README.md` the instructions you're reading right now!

## Notes

1. Feel to use another package manager if you'd like
2. You can use plain JS, although we'd prefer TypeScript
3. Running (and passing) the tests is optional
