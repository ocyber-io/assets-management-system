import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../constants/constants";
import { File } from "../../Types";

// Definition of user types should remain here or be moved to a types file
export interface User {
  userId: string;
  token: string;
  firstname: string;
  lastname: string;
  remainingStorage: number;
  totalStorage: string;
  usedStorage: number;
  favoriteFiles: File[];
}

interface VerifyOtpResponse {
  userId: string;
  message: string;
}

interface VerifyOtpError {
  error: string;
}

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
  any,
  { id: string; updates: Object },
  { rejectValue: string }
>("user/updateUser", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${SERVER_URL}/api/users/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
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

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/users/forgot-password`,
        { email }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data?.message || "Error sending reset email"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk<
  VerifyOtpResponse, // Type of the return value on success
  { email: string; otp: string }, // Argument type
  { rejectValue: VerifyOtpError } // Type of the rejection value
>("user/verifyOtp", async ({ email, otp }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/users/verify-otp`, {
      email,
      otp,
    });
    // Assume the response data is in the correct format
    return response.data as VerifyOtpResponse;
  } catch (error: any) {
    // Create and return a structured error object
    return rejectWithValue({
      error: error.response?.data?.message || "OTP verification failed",
    });
  }
});

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (
    { userId, newPassword }: { userId: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/users/reset-password`,
        { userId, newPassword }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data?.message || "Error resetting password"
      );
    }
  }
);

export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/users/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching user by ID"
      );
    }
  }
);
