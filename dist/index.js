"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = __importDefault(require("./classes/Transaction"));
const SHA256 = require("crypto-js/sha256");
class Block {
    constructor(timestamp, transactions, prevHash = "") {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.hash = this.generateHash();
        /* We need to change the data of the block to generate new hash every while loop check right ?
        so we are using nonce.
        Nonce is a random number that doesn't have anything to do with the block but can be changed to something random*/
        this.nonce = 0;
    }
    generateHash() {
        const hash = SHA256(this.prevHash +
            this.timestamp +
            JSON.stringify(this.transactions) +
            this.nonce).toString();
        return hash;
    }
    mineBlock(difficulty) {
        // Make the hash of block begin with a certin amount of 0s
        // Like what bitcoin requires 𖡬
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.generateHash();
        }
        console.log("block mined ", this.hash);
    }
}
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 100; // If successfully mine a block
    }
    createGenesisBlock() {
        return new Block(Date.now(), [], "0");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.prevHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
        console.log("Block successfully mined!");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction_1.default(null, miningRewardAddress, this.miningReward),
        ];
    }
    createTransaction(t) {
        this.pendingTransactions.push(t);
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
    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                }
                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }
        return balance;
    }
}
let ALFI = new Blockchain();
// This will create a pending transactions:
const tran1 = new Transaction_1.default("addresfrom", "addresTo", 100);
const tran2 = new Transaction_1.default("addresfrom", "addresTo", 50);
ALFI.createTransaction(tran1);
ALFI.createTransaction(tran2);
// Starting the miner ...
console.log("Starting the miner ...");
ALFI.minePendingTransactions("miner-address");
console.log("Balance of miner is ", ALFI.getBalanceOfAddress("miner-address"));
console.log("Starting the miner again ...");
ALFI.minePendingTransactions("miner-address");
console.log("Balance of miner again is ", ALFI.getBalanceOfAddress("miner-address"));
console.log(JSON.stringify(ALFI, null, 4));
console.log("Is this chain valid ? ", ALFI.isChainValid());
