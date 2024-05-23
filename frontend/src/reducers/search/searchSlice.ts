import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../stores/store";
import { File } from "../../Types";
import { SERVER_URL } from "../../constants/constants";

interface SearchState {
  keyword: string;
  searchResults: File[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  keyword: "",
  searchResults: [],
  loading: false,
  error: null,
};

const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem("token");
};

// Define the search thunk
export const searchFiles = createAsyncThunk(
  "files/searchFiles",
  async ({ keyword }: { keyword: string }, { rejectWithValue }) => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        throw new Error("Token not found in local storage");
      }

      // Make a request to your backend API to perform the search
      const response = await axios.get(
        `${SERVER_URL}/api/files/search?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Assuming the response data contains the search results
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setKeyword(state, action: PayloadAction<string>) {
      state.keyword = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        searchFiles.fulfilled,
        (state, action: PayloadAction<File[]>) => {
          state.loading = false;
          state.searchResults = action.payload;
          state.error = null;
        }
      )
      .addCase(searchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to search files";
      });
  },
});

export const selectSearchResults = (state: RootState) =>
  state.search.searchResults;
export const selectSearchLoading = (state: RootState) => state.search.loading;
export const selectSearchError = (state: RootState) => state.search.error;
export const selectKeyword = (state: RootState) => state.search.keyword;

export const { setKeyword } = searchSlice.actions;

export default searchSlice.reducer;
