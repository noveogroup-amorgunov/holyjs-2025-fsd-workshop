import { configureStore } from '@reduxjs/toolkit'
import { popularProductsReducer } from '~/widgets/popular-products'

export const store = configureStore({
  reducer: {
    popularProducts: popularProductsReducer,
  },
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
