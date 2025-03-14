import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from './reduxStore'
import { diContainer } from '../di/useDi'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
  extra: typeof diContainer
}>()
