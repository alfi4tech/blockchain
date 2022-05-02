import Transaction from "./Transaction";
import { SHA256 } from "crypto-js";

class Block {
  timestamp: number;
  transactions: Transaction[];
  prevHash: string;
  hash: string;
  nonce: number;

  constructor(timestamp: number, transactions: Transaction[], prevHash = "") {
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
    const hash = SHA256(
      this.prevHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
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

  IsHasValidTransactions() {
    // Verify all the transactions in the current block!
    for (const tx of this.transactions) {
      if (!tx.isValid) {
        return false;
      }

      return true;
    }
  }
}

export default Block;
