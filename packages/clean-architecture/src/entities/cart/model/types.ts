import type { Product } from '~/shared/global-types'

export interface Cart {
  items: CartItem[]
}

interface CartItem {
  product: Product
  quantity: number
}
