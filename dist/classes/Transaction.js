"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Transaction {
    constructor(from, to, amount) {
        this.fromAddress = from;
        this.toAddress = to;
        this.amount = amount;
    }
}
exports.default = Transaction;
