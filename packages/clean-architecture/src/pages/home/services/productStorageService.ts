import type { Product } from '~/shared/global-types'
import type { ProductStorageService as ProductStorageServicePort } from '~/shared/ports'
import { store } from '~/shared/services'
import { popularProductsSlice } from '../model/popularProducts'

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
    },
  }
}
