// fileSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../stores/store";
import {
  addFile,
  deleteFile,
  deleteMultipleFiles,
  disableMultipleFiles,
  fetchFiles,
  renameFile,
  replaceFile,
  restoreFile,
  restoreMultipleFiles,
  sendFileByEmail,
  toggleFileDisable,
  toggleFileFavorite,
  toggleMultipleFilesFavorite,
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
      })
      .addCase(toggleFileFavorite.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        toggleFileFavorite.fulfilled,
        (state, action: PayloadAction<File>) => {
          state.loading = false;
          const index = state.files.findIndex(
            (file) => file._id === action.payload._id
          );
          if (index !== -1) {
            state.files[index].isFavorite = action.payload.isFavorite;
          }
          state.error = null;
        }
      )
      .addCase(toggleFileFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to toggle file favorite state";
      })
      .addCase(toggleMultipleFilesFavorite.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleMultipleFilesFavorite.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleMultipleFilesFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to toggle favorite status";
      })
      .addCase(deleteMultipleFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteMultipleFiles.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          const deletedIds = action.payload.summary
            .filter(
              (result: any) =>
                result.status === "deleted" ||
                result.status === "marked as deleted"
            )
            .map((result: any) => result.fileId);
          state.files = state.files.filter(
            (file) => !deletedIds.includes(file._id)
          );
          state.error = null;
        }
      )
      .addCase(deleteMultipleFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete multiple files";
      })
      .addCase(restoreMultipleFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreMultipleFiles.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(restoreMultipleFiles.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to restore multiple files";
      })
      .addCase(disableMultipleFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(disableMultipleFiles.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(disableMultipleFiles.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to disable multiple files";
      })
      .addCase(sendFileByEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendFileByEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendFileByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to send file by email";
      });
  },
});

export const selectFiles = (state: RootState) => state.file.files;
export const selectLoading = (state: RootState) => state.file.loading;
export const selectError = (state: RootState) => state.file.error;

export default fileSlice.reducer;
