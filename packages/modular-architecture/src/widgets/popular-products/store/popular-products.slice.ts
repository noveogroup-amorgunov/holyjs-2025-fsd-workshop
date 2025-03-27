import type { Product } from '~/shared/global-types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { rootReducer } from '~/shared/redux'
import { getPopularProducts } from '../services/getPopularProducts'

interface PopularProductsState {
  items: Product[]
  loading: boolean
  error: string | null
}

const initialState: PopularProductsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchPopularProducts = createAsyncThunk(
  'popularProducts/fetch',
  async () => {
    return await getPopularProducts()
  },
)

const slice = createSlice({
  name: 'popularProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPopularProducts.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(fetchPopularProducts.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch products'
        state.loading = false
      })
  },
})

export const popularProductsReducer = slice.reducer

export const popularProductsSlice = slice.injectInto(rootReducer)
