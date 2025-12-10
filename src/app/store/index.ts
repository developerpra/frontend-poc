import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { apiSlice } from "../../services/api/apiSlice";

export const store = configureStore({
  reducer: rootReducer,
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Export types if you need to type your state or dispatch manually
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
