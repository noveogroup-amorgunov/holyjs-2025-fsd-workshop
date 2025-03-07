import type { Product } from '~/types/product'

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest Apple smartphone with advanced features',
    price: { amount: 999.99, currency: 'USD' },
    stock: 10,
  },
  {
    id: '2',
    name: 'MacBook Air M2',
    description: 'Lightweight laptop with Apple Silicon',
    price: { amount: 1299.99, currency: 'USD' },
    stock: 5,
  },
  {
    id: '3',
    name: 'AirPods Pro',
    description: 'Wireless earbuds with noise cancellation',
    price: { amount: 249.99, currency: 'USD' },
    stock: 15,
  },
]

export async function getPopularProducts() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return MOCK_PRODUCTS
}
