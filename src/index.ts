import validate from './utils/sku-validator';
import { SkuNotFound } from './errors';
import { Transaction, StockResponse } from './interfaces';
import { findSkuInStock, findSkuInTransactions } from './services';

export default async function findStock(sku: string): Promise<StockResponse> {
  validate(sku);
  const stock = await findSkuInStock(sku);
  const transactions: Transaction[] = await findSkuInTransactions(sku);

  if (!stock && transactions.length === 0) {
    throw new SkuNotFound();
  }

  let qty = stock?.stock || 0;

  // 1. Assume transaction only has 2 types of order and refund
  // 2. This may result to produce a negative quantity when initial stock is 0 and
  // there are orders exist in the transactions file.

  qty = transactions.reduce(
    (acc, transaction) =>
      transaction.type === 'order'
        ? acc - transaction.qty
        : acc + transaction.qty,
    qty
  );

  return {
    sku,
    qty,
  };
}
