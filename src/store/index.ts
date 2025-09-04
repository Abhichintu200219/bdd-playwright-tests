import { configureStore } from "@reduxjs/toolkit";
import {api} from "../api/index";
import authSlice from '../store/slices/authSlice'

export const store=configureStore({
    reducer:{
        [api.reducerPath]:api.reducer,
        auth:authSlice,
    },
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;