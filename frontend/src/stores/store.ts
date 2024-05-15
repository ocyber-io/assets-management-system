import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/user/userSlice";
import fileReducer from "../reducers/file/fileSlice";
import fileDetailsReducer from "../reducers/file/fileDetailsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    file: fileReducer,
    fileDetails: fileDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
