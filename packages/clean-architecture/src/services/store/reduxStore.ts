import { configureStore } from '@reduxjs/toolkit'
import { popularProductsReducer } from './popularProducts'
import { diContainer } from '../di/useDi'

export const store = configureStore({
  reducer: {
    popularProducts: popularProductsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    thunk: { extraArgument: diContainer }
  })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
