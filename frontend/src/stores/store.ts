import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/user/userSlice";
import fileReducer from "../reducers/file/fileSlice";
import fileDetailsReducer from "../reducers/file/fileDetailsSlice";
import folderReducer from "../reducers/folder/folderSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    file: fileReducer,
    fileDetails: fileDetailsReducer,
    folders: folderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
