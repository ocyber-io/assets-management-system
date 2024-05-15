import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../constants/constants";

export const addFolder = createAsyncThunk(
  "folders/addFolder",
  async (
    folderData: { folderName: string; folderColor: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/folders`,
        folderData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding folder"
      );
    }
  }
);

export const deleteFolder = createAsyncThunk(
  "folders/deleteFolder",
  async (folderId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${SERVER_URL}/api/folders/${folderId}`);
      return folderId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting folder"
      );
    }
  }
);

export const addFileToFolder = createAsyncThunk(
  "folders/addFileToFolder",
  async (
    { folderId, fileId }: { folderId: string; fileId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/folders/${folderId}/files`,
        {
          fileId,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding file to folder"
      );
    }
  }
);

export const deleteFileFromFolder = createAsyncThunk(
  "folders/deleteFileFromFolder",
  async (
    { folderId, fileId }: { folderId: string; fileId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.delete(
        `${SERVER_URL}/api/folders/${folderId}/files/${fileId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting file from folder"
      );
    }
  }
);

export const getFoldersByUserId = createAsyncThunk(
  "folders/getFoldersByUserId",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/folders/user/${userId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching folders by user ID"
      );
    }
  }
);
