import type { ProductStorageService as ProductStorageServicePort } from '~/application/ports'
import { popularProductsSlice } from './store/popularProducts'
import { store } from './store/reduxStore'
import { Product } from '~/domain/product'

interface ProductStorageService extends ProductStorageServicePort {
  setLoadingState: (loading: boolean) => void
}

export function productStorageServiceAdapter(): ProductStorageService {
  const getDispatch = () => store.dispatch

  return {
    setLoadingState: (loading: boolean) => {
      getDispatch()(popularProductsSlice.actions.setLoadingState(loading))
    },

    upsertProducts: async (products: Product[]) => {
      getDispatch()(popularProductsSlice.actions.setProducts(products))
    }
  }
}
