import type { AppDispatch } from '~/core/store/store'
import type { Product } from '~/types/product'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cartStore } from '~/modules/cart/store/cart.store'
import {
  selectPopularProducts,
  selectPopularProductsError,
  selectPopularProductsLoading,
} from '../../store/popular-products.selectors'
import { fetchPopularProducts } from '../../store/popular-products.slice'
import styles from './ProductList.module.css'

export function ProductList() {
  const dispatch = useDispatch<AppDispatch>()
  const products = useSelector(selectPopularProducts)
  const loading = useSelector(selectPopularProductsLoading)
  const error = useSelector(selectPopularProductsError)
  const cartItems = cartStore.getItems()

  useEffect(() => {
    dispatch(fetchPopularProducts())
  }, [dispatch])

  const getAvailableStock = (product: Product) => {
    const cartItem = cartItems.find(item => item.product.id === product.id)
    const inCartQuantity = cartItem?.quantity || 0
    return product.stock - inCartQuantity
  }

  if (loading)
    return <div>Loading...</div>
  if (error) {
    return (
      <div>
        Error:
        {error}
      </div>
    )
  }

  return (
    <div className={styles.productList}>
      <h2>Popular Products</h2>
      <div className={styles.grid}>
        {products.map((product) => {
          const availableStock = getAvailableStock(product)

          return (
            <div key={product.id} className={styles.productCard}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className={styles.price}>
                $
                {product.price.amount.toFixed(2)}
                {' '}
                {product.price.currency}
              </p>
              <p className={`${styles.stock} ${availableStock === 0 ? styles.outOfStock : ''}`}>
                Available:
                {' '}
                {availableStock}
              </p>
              <button
                type="button"
                onClick={() => cartStore.addToCart(product)}
                disabled={availableStock === 0}
              >
                {availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
