import type { Product } from '~/shared/global-types'
import type { ProductService, ProductStorageService } from '~/shared/ports'

interface Props {
  productService: ProductService
  productStorageService: ProductStorageService
}

export function useLoadPopularProducts({ productService, productStorageService }: Props) {
  async function load(): Promise<Product[]> {
    productStorageService.setLoadingState(true)

    const products = await productService.loadPopularProducts()

    productStorageService.upsertProducts(products)
    productStorageService.setLoadingState(false)

    return products
  }

  return { load }
}
