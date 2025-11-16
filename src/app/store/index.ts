import { configureStore } from "@reduxjs/toolkit";

// If you have slices, combine here later.
export const store = configureStore({
  reducer: {}, // empty for now
});

// Types for useAppSelector/useAppDispatch (optional now)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
