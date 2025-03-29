import type { Product } from './types'

export function isAvailable(product: Product): boolean {
  return product.stock > 0
}
