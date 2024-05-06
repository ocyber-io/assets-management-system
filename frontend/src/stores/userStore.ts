import axios from "axios";
import { create } from "zustand";
import { SERVER_URL } from "../constants/constants";

type UserState = {
  user: { userId?: string; token?: string } | null;
  users: any[];
  setUser: (user: { userId: string; token: string }) => void;
  logout: () => void;
  signUp: (formData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) => Promise<void>;
  googleSignUp: (googleData: {
    email: string;
    given_name: string;
    family_name: string;
    googleId: string;
  }) => Promise<void>; // Add this line
  login: (credentials: { email: string; password: string }) => Promise<void>;
  fetchUsers: () => Promise<void>;
  updateUser: (id: string, updates: Object) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
};

interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).response !== undefined;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  users: [],

  setUser: (user) => {
    localStorage.setItem("token", user.token); // Save token to localStorage
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("token"); // Clear token from localStorage
    set({ user: null });
    window.location.reload();
  },

  signUp: async (formData) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/users/signup`,
        formData
      );
      if (response.data && response.data.token) {
        const { userId, token } = response.data;
        get().setUser({ userId, token });
      }
      return response.data;
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("An unknown error occurred during signup");
      }
    }
  },

  googleSignUp: async (googleData: {
    email: string;
    given_name: string;
    family_name: string;
    googleId: string;
  }) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/users/google/signup`,
        {
          email: googleData.email,
          given_name: googleData.given_name,
          family_name: googleData.family_name,
          googleId: googleData.googleId,
        }
      );
      if (response.data && response.data.token) {
        const { userId, token } = response.data;
        get().setUser({ userId, token });
      }
      return response.data;
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("An unknown error occurred during Google signup");
      }
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/users/login`,
        credentials
      );
      if (response.data && response.data.token) {
        const { userId, token } = response.data;
        get().setUser({ userId, token });
      }
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Login failed with unknown error"
        );
      } else {
        throw new Error("An unknown error occurred during login");
      }
    }
  },

  fetchUsers: async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      set({ users: response.data });
    } catch (error) {
      throw new Error("Error fetching users");
    }
  },

  updateUser: async (id, updates) => {
    try {
      const response = await axios.put(
        `${SERVER_URL}/api/users/${id}`,
        updates,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const updatedUsers = get().users.map((user) =>
        user._id === id ? response.data : user
      );
      set({ users: updatedUsers });
    } catch (error) {
      throw new Error("Error updating user");
    }
  },

  deleteUser: async (id) => {
    try {
      await axios.delete(`${SERVER_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const filteredUsers = get().users.filter((user) => user._id !== id);
      set({ users: filteredUsers });
    } catch (error) {
      throw new Error("Error deleting user");
    }
  },
}));
