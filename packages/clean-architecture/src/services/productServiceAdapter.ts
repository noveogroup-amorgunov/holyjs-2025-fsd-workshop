import type { ProductService } from '~/application/ports'
import type { Product } from '~/domain/product'
import { fakeApi } from './api'
import { productMocks } from '@monorepo/shared'

export function productServiceAdapter(): ProductService {
  return {
    loadPopularProducts: () => {
      return fakeApi<Product[]>(productMocks as Product[])
    },
  }
}
