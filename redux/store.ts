import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/userSlice";
import { rtkQueryErrorLogger } from "./middleware";
import { api } from "./services/main";

export const store = configureStore({
  reducer: {
    user: usersReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(rtkQueryErrorLogger),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
