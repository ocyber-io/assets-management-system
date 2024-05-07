import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../constants/constants";

interface User {
  userId: string;
  token: string;
}

interface UserState {
  user: User | null;
  users: any[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  users: [],
  status: "idle",
  error: null,
};

// Async thunks
export const signUp = createAsyncThunk(
  "user/signUp",
  async (
    formData: {
      firstname: string;
      lastname: string;
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/users/signup`,
        formData
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Assuming the error response is of the format { message: "Error message" }
        const message =
          error.response.data?.message || "An error occurred during signup";
        return rejectWithValue(message);
      }
      return rejectWithValue("An unknown error occurred during signup");
    }
  }
);

export const googleSignUp = createAsyncThunk(
  "user/googleSignUp",
  async (
    googleData: {
      email: string;
      given_name: string;
      family_name: string;
      googleId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/users/google/signup`,
        googleData
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const message =
          error.response.data?.message ||
          "An error occurred during Google sign up";
        return rejectWithValue(message);
      }
      return rejectWithValue("Google sign up failed with unknown error");
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/users/login`,
        credentials
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // This assumes your backend error is in the format { message: "Error message" }
        const message =
          error.response.data?.message || "An error occurred during login";
        return rejectWithValue(message);
      }
      return rejectWithValue("Login failed with unknown error");
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).user.user?.token;
      const response = await axios.get(`${SERVER_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Error fetching users");
    }
  }
);

export const updateUser = createAsyncThunk<
  any, // Type of the payload on fulfill
  { id: string; updates: Object }, // Argument type
  { rejectValue: string } // Type of the payload on reject
>("user/updateUser", async ({ id, updates }, { rejectWithValue, getState }) => {
  try {
    const token = (getState() as any).user.user?.token;
    const response = await axios.put(`${SERVER_URL}/api/users/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    // Make sure you're sending back a string as the rejected value
    return rejectWithValue(
      error.response.data?.message || "Unknown error during update"
    );
  }
});

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).user.user?.token;
      await axios.delete(`${SERVER_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue("Error deleting user");
    }
  }
);

// Slice definition
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      state.user = null;
      window.location.reload();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<User>) => {
        localStorage.setItem("token", action.payload.token);
        state.user = action.payload;
        state.status = "idle";
      })
      .addCase(signUp.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(googleSignUp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(googleSignUp.fulfilled, (state, action: PayloadAction<User>) => {
        localStorage.setItem("token", action.payload.token);
        state.user = action.payload;
        state.status = "idle";
      })
      .addCase(googleSignUp.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        localStorage.setItem("token", action.payload.token);
        state.user = action.payload;
        state.status = "idle";
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.users = action.payload;
        state.status = "idle";
      })

      .addCase(updateUser.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        localStorage.setItem("token", action.payload.token);
        state.status = "idle";
      })

      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
        state.status = "idle";
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
