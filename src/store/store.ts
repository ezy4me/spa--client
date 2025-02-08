import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { dashboardApi } from "../services/dashboardApi";
import { bookingsApi } from "../services/bookingsApi";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    dashboard: dashboardApi.reducer,
    bookings: bookingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
