// fileThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../constants/constants";

// Helper function to get the token
const getToken = () => localStorage.getItem("token");

// Fetch files for a user
export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.get(`${SERVER_URL}/api/files/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const token = getToken();
      const response = await axios.post(`${SERVER_URL}/api/files/add`, fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const renameFile = createAsyncThunk(
  "files/renameFile",
  async ({ fileId, newOriginalName }: { fileId: string; newOriginalName: string }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.patch(
        `${SERVER_URL}/api/files/rename/${fileId}`,
        { newOriginalName },
        { headers: { Authorization: `Bearer ${token}` } }
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
      const token = getToken();
      const response = await axios.delete(`${SERVER_URL}/api/files/delete/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleFileDisable = createAsyncThunk(
  "files/toggleDisable",
  async (fileId: string, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.patch(`${SERVER_URL}/api/files/${fileId}/toggleDisable`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const replaceFile = createAsyncThunk(
  "files/replaceFile",
  async ({ fileId, fileData }: { fileId: string; fileData: FormData }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.patch(`${SERVER_URL}/api/files/replace/${fileId}`, fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const restoreFile = createAsyncThunk(
  "files/restoreFile",
  async (fileId: string, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.patch(`${SERVER_URL}/api/files/restore/${fileId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleFileFavorite = createAsyncThunk(
  "files/toggleFavorite",
  async (fileId: string, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.patch(`${SERVER_URL}/api/files/toggleFavorite/${fileId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleMultipleFilesFavorite = createAsyncThunk(
  "files/toggleMultipleFilesFavorite",
  async (fileIds: string[], { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.patch(`${SERVER_URL}/api/files/toggleMultipleFavorite`, { fileIds }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteMultipleFiles = createAsyncThunk(
  "files/deleteMultipleFiles",
  async (fileIds: string[], { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.delete(`${SERVER_URL}/api/files/deleteMultiple`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { fileIds },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const restoreMultipleFiles = createAsyncThunk(
  "files/restoreMultipleFiles",
  async (fileIds: string[], { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.patch(`${SERVER_URL}/api/files/restoreMultiple`, { fileIds }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const disableMultipleFiles = createAsyncThunk(
  "files/disableMultipleFiles",
  async (fileIds: string[], { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.patch(`${SERVER_URL}/api/files/disableMultiple`, { fileIds }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const sendFileByEmail = createAsyncThunk(
  "files/sendFileByEmail",
  async ({ fileId, email, message }: { fileId: string; email: string; message: string }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.post(`${SERVER_URL}/api/files/sendByEmail/${fileId}`, { email, message }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);
