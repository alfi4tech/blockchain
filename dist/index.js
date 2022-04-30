"use strict";
const SHA256 = require("crypto-js/sha256");
class Block {
    constructor(index, timestamp, data, prevHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.generateHash();
    }
    generateHash() {
        const hash = SHA256(this.index + this.prevHash + this.timestamp + JSON.stringify(this.data)).toString();
        return hash;
    }
}
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock() {
        const newDate = new Date(Date.now());
        return new Block(0, newDate, "Genesis Block", "0");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.generateHash();
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
alfi.addBlock(new Block(1, new Date(Date.now()), { amount: 4 }));
alfi.addBlock(new Block(2, new Date(Date.now()), { amount: 10 }));
console.log(JSON.stringify(alfi, null, 4));
console.log("Is this chain valid ? ", alfi.isChainValid());
