import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit'

export type RootState = any

export type AppDispatch = any

export type AppThunk<R = void> = ThunkAction<
  R,
  RootState,
  void,
  UnknownAction
>
