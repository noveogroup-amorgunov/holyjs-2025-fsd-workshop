import styles from './AddToCartButton.module.css'
import { Price } from '../Price/Price'
import { Money } from '@monorepo/shared'

type Props = {
  price: Money
  outOfStock: boolean
  canAddToCart: boolean
  showQuantity?: boolean
  quantity: number
  increaseQuantity: () => void
  decreaseQuantity: () => void
}

const audioUrl = '/public/mixkit-on-or-off-light-switch-tap-2585.wav'

export function AddToCartButton(props: Props) {
  const handleIncreaseQuantity = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation()
    new Audio(audioUrl).play()
    props.increaseQuantity()
  }

  const handleDecreaseQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    new Audio(audioUrl).play()
    props.decreaseQuantity()
  }

  if (props.outOfStock) {
    return <div className={styles.root_outOfStock}>Out of stock</div>
  }

  return (
    <div onClick={props.canAddToCart ? handleIncreaseQuantity : undefined} className={`${styles.root} ${props.quantity === 0 ? styles.root_notInCart : ''}`}>
      <button disabled={props.quantity === 0} className={styles.button} type="button" onClick={handleDecreaseQuantity}>-</button>
      <span className={styles.amount}>{props.quantity > 0 && props.showQuantity ? props.quantity : <Price {...props.price} />}</span>
      <button disabled={!props.canAddToCart} className={styles.button} type="button" onClick={handleIncreaseQuantity}>+</button>
    </div>
  )
}
