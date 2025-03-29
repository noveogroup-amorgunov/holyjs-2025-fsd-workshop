import type { Product } from '~/shared/global-types'
import type { ProductService } from '~/shared/ports'
import { productMocks } from '@monorepo/shared'
import { fakeApi } from './api'

export function productServiceAdapter(): ProductService {
  return {
    loadPopularProducts: () => {
      return fakeApi<Product[]>(productMocks as Product[])
    },
  }
}
