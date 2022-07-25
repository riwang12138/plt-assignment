import { SkuInvalid } from '../errors';
const SKU_REGEX = /^([A-Z\d]{9})(\/\d\d){2}$/;

export default function validate(sku: string): void {
  if (!SKU_REGEX.test(sku)) {
    throw new SkuInvalid();
  }
}
