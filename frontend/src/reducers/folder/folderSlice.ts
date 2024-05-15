import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../stores/store";
import {
  addFileToFolder,
  addFolder,
  deleteFileFromFolder,
  deleteFolder,
  getFoldersByUserId,
} from "./folderThunk";
import { File } from "../../Types";

interface Folder {
  _id: string;
  folderName: string;
  folderColor: string;
  userId: string;
  files: File[]; // Assuming file IDs are stored as strings
}

interface FolderState {
  folders: Folder[];
  files: { [folderId: string]: File[] }; // Changed to an object to store files by folder ID
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: FolderState = {
  folders: [],
  files: {}, // Initialize as an empty object
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
      .addCase(
        addFileToFolder.fulfilled,
        (state, action: PayloadAction<Folder>) => {
          // Update folder state accordingly if needed
          state.status = "idle";
        }
      )
      .addCase(addFileToFolder.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      .addCase(deleteFileFromFolder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        deleteFileFromFolder.fulfilled,
        (state, action: PayloadAction<Folder>) => {
          // Update folder state accordingly if needed
          state.status = "idle";
        }
      )
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
      });
  },
});

export const selectFolders = (state: RootState) => state.folders.folders;
export const selectFilesByFolderId = (folderId: string) => (state: RootState) =>
  state.folders.files[folderId] || []; // Selector to get files by folder ID

export default folderSlice.reducer;
