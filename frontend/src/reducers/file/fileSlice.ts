// fileSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../stores/store";
import { addFile, fetchFiles, renameFile } from "./fileThunks";
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
      });
  },
});

export const selectFiles = (state: RootState) => state.file.files;
export const selectLoading = (state: RootState) => state.file.loading;
export const selectError = (state: RootState) => state.file.error;

export default fileSlice.reducer;
