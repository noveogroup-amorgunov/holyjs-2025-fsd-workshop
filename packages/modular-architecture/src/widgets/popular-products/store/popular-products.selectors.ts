import type { AppState } from '~/shared/redux'
import { createSelector } from '@reduxjs/toolkit'

const selectPopularProductsState = (state: AppState) => state.popularProducts

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
