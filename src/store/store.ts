import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { dashboardApi } from "../services/dashboardApi";
import { bookingsApi } from "../services/bookingsApi";
import { clientsApi } from "../services/clientsApi";
import authReducer from "./slice/authSlice";
import { usersApi } from "../services/usersApi";
import { roomApi } from "../services/roomApi";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    dashboard: dashboardApi.reducer,
    bookings: bookingsApi.reducer,
    clientsApi: clientsApi.reducer,
    usersApi: usersApi.reducer,
    roomApi: roomApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
