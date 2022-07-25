import findStock from '../index';
import { Stock, Transaction, StockResponse } from '../interfaces';
import { findSkuInStock, findSkuInTransactions } from '../services';
import { SkuNotFound, SkuInvalid } from '../errors';

jest.mock('../services');
const mockedFindSkuInTransactions = findSkuInTransactions as jest.Mock<
  Promise<Transaction[]>
>;
const mockedFindSkuInStock = findSkuInStock as jest.Mock<
  Promise<Stock | undefined>
>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('findStock function', () => {
  describe('should respond with an correct result', () => {
    it('Records only exist in stock file', async () => {
      const sku = 'MQO013465/10/41';
      const stock = 3552;
      mockedFindSkuInStock.mockResolvedValue({
        sku,
        stock,
      });
      mockedFindSkuInTransactions.mockResolvedValue([]);
      const res: StockResponse = await findStock(sku);
      expect(res).toEqual({ sku, qty: stock });
    });

    it('Records only exist in transaction file with order type', async () => {
      const sku = 'MQO013465/10/41';
      mockedFindSkuInStock.mockResolvedValue(undefined);
      mockedFindSkuInTransactions.mockResolvedValue([
        {
          sku,
          type: 'order',
          qty: 2,
        },
      ]);
      const res: StockResponse = await findStock(sku);
      expect(res).toEqual({ sku, qty: -2 });
    });

    it('Records only exist in transaction file with refund type', async () => {
      const sku = 'MQO013465/10/41';
      mockedFindSkuInStock.mockResolvedValue(undefined);
      mockedFindSkuInTransactions.mockResolvedValue([
        {
          sku,
          type: 'refund',
          qty: 2,
        },
      ]);
      const res: StockResponse = await findStock(sku);
      expect(res).toEqual({ sku, qty: 2 });
    });

    it('Records exist in both stock file and transactions with order type', async () => {
      const sku = 'MQO013465/10/41';
      const stock = 3552;
      mockedFindSkuInStock.mockResolvedValue({
        sku,
        stock,
      });
      mockedFindSkuInTransactions.mockResolvedValue([
        {
          sku,
          type: 'order',
          qty: 2,
        },
      ]);
      const res: StockResponse = await findStock(sku);
      expect(res).toEqual({ sku, qty: 3550 });
    });

    it('Records exist in both stock file and transactions with refund type', async () => {
      const sku = 'MQO013465/10/41';
      const stock = 3552;
      mockedFindSkuInStock.mockResolvedValue({
        sku,
        stock,
      });
      mockedFindSkuInTransactions.mockResolvedValue([
        {
          sku,
          type: 'refund',
          qty: 2,
        },
      ]);
      const res: StockResponse = await findStock(sku);
      expect(res).toEqual({ sku, qty: 3554 });
    });

    it('Records exist in both stock file and transactions with refund and order type', async () => {
      const sku = 'MQO013465/10/41';
      const stock = 3552;
      mockedFindSkuInStock.mockResolvedValue({
        sku,
        stock,
      });
      mockedFindSkuInTransactions.mockResolvedValue([
        {
          sku,
          type: 'refund',
          qty: 2,
        },
        {
          sku,
          type: 'order',
          qty: 3,
        },
      ]);
      const res: StockResponse = await findStock(sku);
      expect(res).toEqual({ sku, qty: 3551 });
    });
  });

  describe('should throws correct error', () => {
    it('should throw SkuInvalid error', async () => {
      const sku = 'invalid sku';
      await expect(() => findStock(sku)).rejects.toThrow(new SkuInvalid());
    });

    it('should throw SkuNotFound error', async () => {
      const sku = 'MQO013465/10/41';
      mockedFindSkuInStock.mockResolvedValue(undefined);
      mockedFindSkuInTransactions.mockResolvedValue([]);
      await expect(() => findStock(sku)).rejects.toThrow(new SkuNotFound());
    });
  });
});
