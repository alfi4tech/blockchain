"use strict";
exports.__esModule = true;
var Transaction_1 = require("./classes/Transaction.js");
var SHA256 = require("crypto-js/sha256");
Date.now();
var Block = /** @class */ (function () {
  function Block(timestamp, transactions, prevHash) {
    if (prevHash === void 0) {
      prevHash = "";
    }
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.prevHash = prevHash;
    this.hash = this.generateHash();
    /* We need to change the data of the block to generate new hash every while loop check right ?
        so we are using nonce.
        Nonce is a random number that doesn't have anything to do with the block but can be changed to something random*/
    this.nonce = 0;
  }
  Block.prototype.generateHash = function () {
    var hash = SHA256(
      this.prevHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
    return hash;
  };
  Block.prototype.mineBlock = function (difficulty) {
    // Make the hash of block begin with a certin amount of 0s
    // Like what bitcoin requires 𖡬
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.generateHash();
    }
    console.log("block mined ", this.hash);
  };
  return Block;
})();
var Blockchain = /** @class */ (function () {
  function Blockchain() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 100; // If successfully mine a block
  }
  Blockchain.prototype.createGenesisBlock = function () {
    return new Block(Date.now(), [], "0");
  };
  Blockchain.prototype.getLatestBlock = function () {
    return this.chain[this.chain.length - 1];
  };
  Blockchain.prototype.addBlock = function (newBlock) {
    newBlock.prevHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  };
  Blockchain.prototype.minePendingTransactions = function (
    miningRewardAddress
  ) {
    var block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    console.log("Block successfully mined!");
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction_1["default"](
        null,
        miningRewardAddress,
        this.miningReward
      ),
    ];
  };
  Blockchain.prototype.createTransaction = function (t) {
    this.pendingTransactions.push(t);
  };
  Blockchain.prototype.isChainValid = function () {
    /*
        // Check if chain valid:
        1] check if the current block valid
        2] check if the current block hash = previous block hash
      */
    for (var i = 1; i < this.chain.length; i++) {
      var currentBlock = this.chain[i];
      var prevBlock = this.chain[i - 1];
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
  };
  Blockchain.prototype.getBalanceOfAddress = function (address) {
    var balance = 0;
    for (var _i = 0, _a = this.chain; _i < _a.length; _i++) {
      var block = _a[_i];
      for (var _b = 0, _c = block.transactions; _b < _c.length; _b++) {
        var transaction = _c[_b];
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }
        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }
    return balance;
  };
  return Blockchain;
})();
var ALFI = new Blockchain();
//console.log(JSON.stringify(alfi, null, 4));
//console.log("Is this chain valid ? ", ALFI.isChainValid());
// This will create a pending transactions:
var tran1 = new Transaction_1["default"]("addresfrom", "addresTo", 100);
var tran2 = new Transaction_1["default"]("addresfrom", "addresTo", 50);
ALFI.createTransaction(tran1);
ALFI.createTransaction(tran2);
// Starting the miner ...
console.log("Starting the miner ...");
ALFI.minePendingTransactions("miner-address");
console.log("Balance of miner is ", ALFI.getBalanceOfAddress("miner-address"));
