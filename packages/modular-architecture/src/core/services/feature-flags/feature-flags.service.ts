// {
//   id: 'darkTheme',
//   name: 'Dark Theme',
//   enabled: true,
//   description: 'Enable dark theme option'
// },
// {
//   id: 'cart',
//   name: 'Shopping Cart',
//   enabled: true,
//   description: 'Enable shopping cart functionality'
// },
// {
//   id: 'productRatings',
//   name: 'Product Ratings',
//   enabled: false,
//   description: 'Show product ratings and reviews'
// }

import { signal } from '@preact/signals'

export interface FeatureFlagsStore {
  darkTheme: boolean
  cart: boolean
  productRatings: boolean
}

export const featureFlagsStore = signal<FeatureFlagsStore>({
  darkTheme: false,
  cart: true,
  productRatings: false,
})

export const featureFlagService = {
  getAll: () => Object.entries(featureFlagsStore.value).map(([key, value]) => ({
    id: key,
    name: key,
    description: key,
    enabled: value,
  })),
  get: (featureFlag: keyof FeatureFlagsStore) => featureFlagsStore.value[featureFlag],
  toggle: (featureFlag: keyof FeatureFlagsStore) => {
    featureFlagsStore.value = {
      ...featureFlagsStore.value,
      [featureFlag]: !featureFlagsStore.value[featureFlag],
    }
  },
}
