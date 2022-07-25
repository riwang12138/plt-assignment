export class SkuInvalid extends Error {
  constructor() {
    const message = 'SKU in invalid format';
    super(message);
    this.name = 'SkuInvalid';
    this.message = message;
  }
}
