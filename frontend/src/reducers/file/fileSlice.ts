// fileSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../stores/store";
import {
  addFile,
  deleteFile,
  fetchFiles,
  renameFile,
  replaceFile,
  restoreFile,
  toggleFileDisable,
} from "./fileThunks";
import { File } from "../../Types";

export interface FileState {
  files: File[];
  loading: boolean;
  error: string | null;
}

const initialState: FileState = {
  files: [],
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle async thunk for fetching files
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFiles.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.files = action.payload;
        state.error = null;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch files";
      })
      // Handle async thunk for adding a file
      .addCase(addFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.files.push(action.payload);
        state.error = null;
      })
      .addCase(addFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add file";
      })
      .addCase(renameFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(renameFile.fulfilled, (state, action: PayloadAction<File>) => {
        state.loading = false;
        const index = state.files.findIndex(
          (file) => file._id === action.payload._id
        );
        if (index !== -1) {
          state.files[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(renameFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to rename file";
      })
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFile.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.files = state.files.filter((file) => file._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete file";
      })
      .addCase(toggleFileDisable.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        toggleFileDisable.fulfilled,
        (state, action: PayloadAction<File>) => {
          state.loading = false;
          const index = state.files.findIndex(
            (file) => file._id === action.payload._id
          );
          if (index !== -1) {
            state.files[index].isDisabled = action.payload.isDisabled;
          }
          state.error = null;
        }
      )
      .addCase(toggleFileDisable.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to toggle file disable state";
      })
      .addCase(replaceFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(replaceFile.fulfilled, (state, action: PayloadAction<File>) => {
        state.loading = false;
        const index = state.files.findIndex(
          (file) => file._id === action.payload._id
        );
        if (index !== -1) {
          state.files[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(replaceFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to replace file";
      })
      .addCase(restoreFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreFile.fulfilled, (state, action: PayloadAction<File>) => {
        state.loading = false;
        const index = state.files.findIndex(
          (file) => file._id === action.payload._id
        );
        if (index !== -1) {
          state.files[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(restoreFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to restore file";
      });
  },
});

export const selectFiles = (state: RootState) => state.file.files;
export const selectLoading = (state: RootState) => state.file.loading;
export const selectError = (state: RootState) => state.file.error;

export default fileSlice.reducer;
