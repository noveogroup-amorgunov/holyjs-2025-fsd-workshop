import { useDi } from '~/core/di/useDi'
import { cartStore } from '../../store/cart.store'
import styles from './Cart.module.css'

export function Cart() {
  const featureFlagsService = useDi('FEATURE_FLAGS_SERVICE_TOKEN')
  const items = cartStore.getItems()
  const total = cartStore.getTotal()

  const handleQuantityChange = (productId: string, delta: number, currentQuantity: number, maxStock: number) => {
    const newQuantity = currentQuantity + delta
    if (newQuantity > 0 && newQuantity <= maxStock) {
      cartStore.updateQuantity(productId, newQuantity)
    }
  }

  return (
    <div className={styles.cart}>
      <div>
        enable feature flag darkTheme:
        {featureFlagsService.get('darkTheme') ? 'true' : 'false'}
      </div>
      <button type="button" onClick={() => featureFlagsService.toggle('darkTheme')}>Toggle feature flag darkTheme</button>

      <h2>Shopping Cart</h2>
      {items.length === 0
        ? (
            <p>Your cart is empty</p>
          )
        : (
            <>
              <div className={styles.cartItems}>
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className={styles.cartItem}>
                    <div className={styles.itemInfo}>
                      <span>{product.name}</span>
                      <span className={styles.price}>
                        $
                        {product.price.amount.toFixed(2)}
                        {' '}
                        x
                        {' '}
                        {quantity}
                      </span>
                    </div>
                    <div className={styles.itemActions}>
                      <div className={styles.quantityControls}>
                        <button
                          type="button"
                          className={styles.quantityButton}
                          onClick={() => handleQuantityChange(product.id, -1, quantity, product.stock)}
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{quantity}</span>
                        <button
                          type="button"
                          className={styles.quantityButton}
                          onClick={() => handleQuantityChange(product.id, 1, quantity, product.stock)}
                          disabled={quantity >= product.stock}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => cartStore.removeFromCart(product.id)}
                        className={styles.removeButton}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.cartTotal}>
                <strong>
                  Total: $
                  {total.toFixed(2)}
                  {' '}
                  USD
                </strong>
              </div>
            </>
          )}
    </div>
  )
}
