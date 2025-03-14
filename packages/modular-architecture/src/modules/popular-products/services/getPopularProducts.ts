import type { Product } from '~/types/product'
import { productMocks } from '@monorepo/shared'

export async function getPopularProducts() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return productMocks as unknown as Product[]
}
