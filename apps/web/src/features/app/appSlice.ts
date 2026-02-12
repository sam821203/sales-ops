import { createSlice } from '@reduxjs/toolkit';

export type AppState = {
  initialized: boolean;
};

const initialState: AppState = {
  initialized: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
});

export const appReducer = appSlice.reducer;

