import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/user/userSlice";
import fileReducer from "../reducers/file/fileSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    file: fileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
