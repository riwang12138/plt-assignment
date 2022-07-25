import { Stock } from '../interfaces';

export async function findSkuInStock(sku: string): Promise<Stock | undefined> {
  const stocks: Stock[] = require('./files/stock.json');
  return stocks.find((s) => s.sku === sku);
}
