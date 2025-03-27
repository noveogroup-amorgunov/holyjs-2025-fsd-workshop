import type { AppState } from '~/shared/redux'
import { createSelector } from '@reduxjs/toolkit'
import { popularProductsSlice } from './popular-products.slice'

const selectPopularProductsState = (state: AppState) => popularProductsSlice.selectSlice(state)

export const selectPopularProducts = createSelector(
  [selectPopularProductsState],
  state => state.items,
)

export const selectPopularProductsLoading = createSelector(
  [selectPopularProductsState],
  state => state.loading,
)

export const selectPopularProductsError = createSelector(
  [selectPopularProductsState],
  state => state.error,
)
