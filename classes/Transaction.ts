class Transaction {
  fromAddress: string | null;
  toAddress: string;
  amount: number;

  constructor(from: string | null, to: string, amount: number) {
    this.fromAddress = from;
    this.toAddress = to;
    this.amount = amount;
  }
}

export default Transaction;
