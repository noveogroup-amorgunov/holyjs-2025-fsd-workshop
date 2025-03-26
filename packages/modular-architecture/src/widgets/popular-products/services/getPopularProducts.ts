import type { Product } from '~/shared/global-types'
import { productMocks } from '@monorepo/shared'
import { fakeApi } from '~/shared/api'

export async function getPopularProducts() {
  return fakeApi(productMocks as unknown as Product[])
}
