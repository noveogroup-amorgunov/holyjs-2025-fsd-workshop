export interface Product {
  id: string
  name: string
  description: string
  price: {
    amount: number
    currency: string
  }
  stock: number
}
