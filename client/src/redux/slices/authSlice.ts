import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

interface AuthState {
  user: { id: number; name: string; email: string } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData: { name: string; email: string; password: string }, thunkAPI) => {
    const res = await authService.register(formData);
    return res.user; // Assuming res contains { user, message }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData: { email: string; password: string }, thunkAPI) => {
    const res = await authService.login(formData); // ✅ Cookie is set
    return res.user;
  }
);

export const getMe = createAsyncThunk("auth/getMe", async (_, thunkAPI) => {
  const res = await authService.getMe();
  return res.user;
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
  const res = await authService.logout();
  return res.message;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ id: number; name: string; email: string }>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Registration failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ id: number; name: string; email: string }>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<{ id: number; name: string; email: string }>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Logout failed";
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;