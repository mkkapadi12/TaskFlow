import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/auth/auth.slice';

import { baseApi } from './baseApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
