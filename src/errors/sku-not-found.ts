export class SkuNotFound extends Error {
  constructor() {
    const message = 'SKU does not exist';
    super(message);
    this.name = 'SkuNotFound';
    this.message = message;
  }
}
