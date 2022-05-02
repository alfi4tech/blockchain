import "./key-generator";
import Blockchain from "./classes/Blockchain";
import Transaction from "./classes/Transaction";
import { ec } from "./utils/elliptic";

const myKey = ec.keyFromPrivate(
  "8e8ce2f3280b71c244bcc9b3dfa880ef85f9d9f9a5c2051b2ca118c487d7ea52"
);
const myWalletAddress = myKey.getPublic("hex");

let ALFI = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "public key goes here", 10);
tx1.signTransaction(myKey);
ALFI.addTransaction(tx1);

console.log("Strting the miner ... ");
ALFI.minePendingTransactions(myWalletAddress);
