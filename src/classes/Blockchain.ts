import Transaction from "./Transaction";
import Block from "./Block";

class Blockchain {
  chain: Block[];
  difficulty: number;

  pendingTransactions: Transaction[];
  miningReward: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;

    this.pendingTransactions = [];
    this.miningReward = 100; // If successfully mine a block
  }

  createGenesisBlock() {
    return new Block(Date.now(), [], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress: string) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.prevHash = this.getLatestBlock().hash;
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!");

    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward), // FROM, TO, AMOUNT
    ];
  }

  addTransaction(t: Transaction) {
    if (!t.fromAddress || !t.toAddress) {
      throw new Error("Tranasction must include from and to address!");
    }

    if (!t.isValid()) {
      throw new Error("Cannot add invalid transaction to the chain!");
    }

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

      // We also have to verify that all the transactions in the current block are valid:
      if (!currentBlock.IsHasValidTransactions()) {
        return false;
      }

      return true;
    }
  }

  getBalanceOfAddress(address: string) {
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

export default Blockchain;
