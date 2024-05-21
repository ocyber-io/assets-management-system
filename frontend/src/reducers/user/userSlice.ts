import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  User,
  signUp,
  googleSignUp,
  login,
  fetchUsers,
  updateUser,
  deleteUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getUserById,
} from "./userThunks";
import { RootState } from "../../stores/store";

interface UserState {
  user: User | null;
  users: any[];
  status: "idle" | "loading" | "failed";
  error: string | null;
  forgotPasswordStatus: "idle" | "loading" | "failed";
  resetPasswordStatus: "idle" | "loading" | "failed";
  otpVerificationStatus: "idle" | "loading" | "failed";
}

const initialState: UserState = {
  user: null,
  users: [],
  status: "idle",
  error: null,
  forgotPasswordStatus: "failed",
  resetPasswordStatus: "failed",
  otpVerificationStatus: "failed",
};

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
        // localStorage.setItem("token", action.payload.token);
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
      })
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordStatus = "loading";
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordStatus = "idle";
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action: PayloadAction<any>) => {
        state.forgotPasswordStatus = "failed";
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.otpVerificationStatus = "loading";
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.otpVerificationStatus = "idle";
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action: PayloadAction<any>) => {
        state.otpVerificationStatus = "failed";
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordStatus = "loading";
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordStatus = "idle";
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action: PayloadAction<any>) => {
        state.resetPasswordStatus = "failed";
        state.error = action.payload;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "idle";
      });
  },
});

export const selectUser = (state: RootState) => state.user.user;

export const { logout } = userSlice.actions;

export default userSlice.reducer;
