import Blockchain from "./classes/Blockchain";
import Transaction from "./classes/Transaction";

let ALFI = new Blockchain();

// This will create a pending transactions:
const tran1 = new Transaction("addresfrom", "addresTo", 100);
const tran2 = new Transaction("addresfrom", "addresTo", 50);
ALFI.createTransaction(tran1);
ALFI.createTransaction(tran2);

// Starting the miner ...
console.log("Starting the miner ...");
ALFI.minePendingTransactions("miner-address");

console.log("Balance of miner is ", ALFI.getBalanceOfAddress("miner-address"));

console.log("Starting the miner again ...");
ALFI.minePendingTransactions("miner-address");

console.log(
  "Balance of miner again is ",
  ALFI.getBalanceOfAddress("miner-address")
);

console.log(JSON.stringify(ALFI, null, 4));
console.log("Is this chain valid ? ", ALFI.isChainValid());
