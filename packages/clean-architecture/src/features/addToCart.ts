import type { Product } from '~/shared/global-types'
import type { CartStorageService, NotificationService } from '~/shared/ports'
import { addProduct, removeProduct } from '~/entities/cart'

interface Props {
  cartStorageService: CartStorageService
  notificationService: NotificationService
}

export function useAddToCart({ cartStorageService, notificationService }: Props) {
  function addToCart(product: Product, quantity?: number): void {
    // TODO: Add stocks check
    const cart = cartStorageService.getCart()

    if (quantity === 0) {
      const updated = removeProduct(cart, product)
      cartStorageService.updateCart(updated)
      return
    }

    const updated = addProduct(cart, product, quantity)
    cartStorageService.updateCart(updated)

    notificationService.notify(`Add ${product.name} to cart`)
  }

  return { addToCart }
}
