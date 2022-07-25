import { Transaction } from '../interfaces';

export async function findSkuInTransactions(
  sku: string
): Promise<Transaction[]> {
  const transactions: Transaction[] = require('./files/transactions.json');
  return transactions.filter((s) => s.sku === sku);
}
