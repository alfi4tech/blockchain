import { SHA256 } from "crypto-js";
import { ec, EC } from "../utils/elliptic";
class Transaction {
  fromAddress: string | null;
  toAddress: string;
  amount: number;
  signature: string;

  constructor(from: string | null, to: string, amount: number) {
    this.fromAddress = from;
    this.toAddress = to;
    this.amount = amount;
    this.signature = "";
  }

  generateHash() {
    /* This will return the sha256 hash of that transaction .. why ? 
     This hash that we're going to sign with our private key.
     We're not going to sign all the data in our transaction,
    we're just going to sign the hash of our transaction
    */

    return SHA256(this.amount + this.fromAddress! + this.toAddress).toString();
  }

  signTransaction(signingKey: EC.ec.KeyPair) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      /*You can only spend coins trom the wallet that you have the private key for
      And because the private key is linked to the public key, that means that the from
      address in our transaction has to equal your public key */
      throw new Error("You can't sign transactions for others wallets!");
    }

    const transactionHash = this.generateHash();
    const sig = signingKey.sign(transactionHash, "base64");

    // Store the signature
    this.signature = sig.toDER("hex");
  }

  isValid() {
    // Verify if our transaction has been correctly signed;

    if (!this.fromAddress) return true; // Miner reward transactions

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction!");
    }

    /*
      Now the transaction in not from the NULL address, and it has a signature!
      and now we have of course verify that the transaction was signed with the correct key.
      We are going to make a new public key object from the FROM ADDRESS,
      ** rememper, the from address is a public key ! 
    */
    const publickey = ec.keyFromPublic(this.fromAddress, "hex");
    return publickey.verify(this.generateHash(), this.signature);
  }
}

export default Transaction;
