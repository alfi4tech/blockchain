const SHA256 = require("crypto-js/sha256");

class Block {
  index: number;
  timestamp: any;
  data: any;
  prevHash: string;
  hash: string;
  nonce: number;

  constructor(index: number, timestamp: Date, data: any, prevHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.generateHash();

    /* We need to change the data of the block to generate new hash every while loop check right ? 
    so we are using nonce.
    Nonce is a random number that doesn't have anything to do with the block but can be changed to something random*/
    this.nonce = 0;
  }

  generateHash() {
    const hash = SHA256(
      this.index +
        this.prevHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();

    return hash;
  }

  mineBlock(difficulty: number) {
    // Make the hash of block begin with a certin amount of 0s
    // Like what bitcoin requires 𖡬

    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.generateHash();
    }

    console.log("block mined ", this.hash);
  }
}

class Blockchain {
  chain: Block[];
  difficulty: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    const newDate = new Date(Date.now());
    return new Block(0, newDate, "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock: Block) {
    newBlock.prevHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    /*
    // Check if chain valid:
    1] check if the current block valid
    2] check if the current block hash = previous block hash
  */

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (!(currentBlock.hash === currentBlock.generateHash())) {
        console.log("current block hash !== currentBlock actuall hash");
        return false;
      }

      if (!(currentBlock.prevHash === prevBlock.hash)) {
        console.log("current block previous hash !== previous hash");
        return false;
      }

      return true;
    }
  }
}

let alfi = new Blockchain();

console.log("Mining block ...");
alfi.addBlock(new Block(1, new Date(Date.now()), { amount: 4 }));

console.log("Mining next block ...");
alfi.addBlock(new Block(2, new Date(Date.now()), { amount: 10 }));

//console.log(JSON.stringify(alfi, null, 4));
console.log("Is this chain valid ? ", alfi.isChainValid());
