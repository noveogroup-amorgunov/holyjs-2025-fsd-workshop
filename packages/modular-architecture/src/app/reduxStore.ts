import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from '../shared/redux'

export const store = configureStore({
  reducer: rootReducer,
})
