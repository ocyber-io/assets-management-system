import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FileDetailsState {
  oldFileDetails: any | null; // Replace 'any' with your file details type
  newFileDetails: any | null; // Replace 'any' with your file details type
}

const initialState: FileDetailsState = {
  oldFileDetails: null,
  newFileDetails: null,
};

const fileDetailsSlice = createSlice({
  name: "fileDetails",
  initialState,
  reducers: {
    saveOldFileDetails(state, action: PayloadAction<any>) {
      // Replace 'any' with your file details type
      state.oldFileDetails = action.payload;
    },
    saveNewFileDetails(state, action: PayloadAction<any>) {
      // Replace 'any' with your file details type
      state.newFileDetails = action.payload;
    },
    getOldFileDetails(state) {
      return state.oldFileDetails;
    },
    getNewFileDetails(state) {
      return state.newFileDetails;
    },
    clearFileDetails(state) {
      state.oldFileDetails = null;
      state.newFileDetails = null;
    },
  },
});

export const {
  saveOldFileDetails,
  saveNewFileDetails,
  getOldFileDetails,
  getNewFileDetails,
  clearFileDetails,
} = fileDetailsSlice.actions;

export default fileDetailsSlice.reducer;
