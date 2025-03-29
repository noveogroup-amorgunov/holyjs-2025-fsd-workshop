import { configureStore } from '@reduxjs/toolkit'
// import { diContainer } from '../di/useDi'
import { popularProductsReducer } from '~/pages/home'

// TODO: move to app layer
export const store = configureStore({
  reducer: {
    popularProducts: popularProductsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    thunk: { extraArgument: {} }, // diContainer },
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
