import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../stores/store";
import { File, Folder } from "../../Types";
import {
  addFileToFolder,
  addFolder,
  deleteFileFromFolder,
  deleteFolder,
  deleteMultipleFolders,
  getFolderById,
  getFoldersByUserId,
  restoreFolder,
  restoreMultipleFolders,
  updateFolder,
} from "./folderThunk";

interface FolderState {
  folders: Folder[];
  folder: Folder | null;
  files: { [folderId: string]: File[] };
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: FolderState = {
  folders: [],
  folder: null, // Initialize as null
  files: {},
  status: "idle",
  error: null,
};

const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addFolder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addFolder.fulfilled, (state, action: PayloadAction<Folder>) => {
        state.folders.push(action.payload);
        state.status = "idle";
      })
      .addCase(addFolder.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      .addCase(deleteFolder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        deleteFolder.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.folders = state.folders.filter(
            (folder) => folder._id !== action.payload
          );
          state.status = "idle";
        }
      )
      .addCase(deleteFolder.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      .addCase(addFileToFolder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addFileToFolder.fulfilled, (state) => {
        // Update folder state accordingly if needed
        state.status = "idle";
      })
      .addCase(addFileToFolder.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      .addCase(deleteFileFromFolder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteFileFromFolder.fulfilled, (state) => {
        // Update folder state accordingly if needed
        state.status = "idle";
      })
      .addCase(deleteFileFromFolder.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      .addCase(getFoldersByUserId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getFoldersByUserId.fulfilled,
        (state, action: PayloadAction<Folder[]>) => {
          state.folders = action.payload;
          // Populate files by folder ID
          state.files = action.payload.reduce((acc, folder) => {
            acc[folder._id] = folder.files;
            return acc;
          }, {} as { [folderId: string]: File[] });
          state.status = "idle";
        }
      )
      .addCase(getFoldersByUserId.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      .addCase(updateFolder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateFolder.fulfilled,
        (state, action: PayloadAction<Folder>) => {
          const updatedFolderIndex = state.folders.findIndex(
            (folder) => folder._id === action.payload._id
          );
          if (updatedFolderIndex !== -1) {
            state.folders[updatedFolderIndex] = action.payload;
          }
          state.status = "idle";
        }
      )
      .addCase(updateFolder.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      .addCase(getFolderById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getFolderById.fulfilled,
        (state, action: PayloadAction<Folder>) => {
          state.folder = action.payload;
          state.status = "idle";
        }
      )
      .addCase(getFolderById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      .addCase(restoreFolder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        restoreFolder.fulfilled,
        (state, action: PayloadAction<Folder>) => {
          const restoredFolderIndex = state.folders.findIndex(
            (folder) => folder._id === action.payload._id
          );
          if (restoredFolderIndex !== -1) {
            state.folders[restoredFolderIndex] = action.payload;
          } else {
            state.folders.push(action.payload);
          }
          state.status = "idle";
        }
      )
      .addCase(restoreFolder.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      .addCase(deleteMultipleFolders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        deleteMultipleFolders.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.folders = state.folders.filter(
            (folder) => !action.payload.includes(folder._id)
          );
          state.status = "idle";
        }
      )
      .addCase(deleteMultipleFolders.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      // New cases for restoreMultipleFolders
      .addCase(restoreMultipleFolders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        restoreMultipleFolders.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.folders = state.folders.map((folder) =>
            action.payload.includes(folder._id)
              ? { ...folder, isDeleted: false }
              : folder
          );
          state.status = "idle";
        }
      )
      .addCase(restoreMultipleFolders.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      });
  },
});

export const selectFolders = (state: RootState) => state.folders.folders;
export const selectFilesByFolderId = (folderId: string) => (state: RootState) =>
  state.folders.files[folderId] || []; // Selector to get files by folder ID
export const selectFolder = (state: RootState) => state.folders.folder;
export const selectFolderLoading = (state: RootState) => state.folders.status;

export default folderSlice.reducer;
