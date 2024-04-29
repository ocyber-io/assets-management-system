// useFileStore.js
import { create } from "zustand";
import axios from "axios";
import { serverUrl } from "../constants/constants";

const useFileStore = create((set, get) => ({
  files: [],
  isLoading: false,
  error: null,
  fetchFiles: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${serverUrl}/file`);
      set({ files: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchFileById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${serverUrl}/file/${id}`);
      set({ files: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  uploadFile: async (formData) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${serverUrl}/file/upload`, formData);
      set((state) => ({
        files: [...state.files, response.data.newFile],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  editFile: async (id, updateData) => {
    set({ isLoading: true });
    try {
      const response = await axios.put(`${serverUrl}/file/${id}`, updateData);
      const updatedFiles = get().files.map((file) =>
        file._id === id ? response.data.file : file
      );
      set({ files: updatedFiles, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  deleteFile: async (id) => {
    set({ isLoading: true });
    try {
      await axios.delete(`${serverUrl}/file/${id}`);
      const filteredFiles = get().files.filter((file) => file._id !== id);
      set({ files: filteredFiles, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useFileStore;
