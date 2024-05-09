// fileThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../constants/constants";

// Fetch files for a user
export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/files/user/${userId}`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Add a file
export const addFile = createAsyncThunk(
  "files/addFile",
  async (fileData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/files/add`,
        fileData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const renameFile = createAsyncThunk(
  "files/renameFile",
  async (
    { fileId, newOriginalName }: { fileId: string; newOriginalName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch(
        `${SERVER_URL}/api/files/rename/${fileId}`,
        { newOriginalName }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (fileId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${SERVER_URL}/api/files/delete/${fileId}`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);
