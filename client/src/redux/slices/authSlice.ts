import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { AuthResponse, RegisterData, LoginData, UserResponse } from 'types';

export interface AuthState {
  user: { id: number; name: string; email: string } | null;
  isInitialized: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isInitialized: false,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk('auth/login', async (data: LoginData) => {
  try {
    const response = await authService.login(data);
    return response;
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async () => {
  try {
    const response = await authService.getMe();
    console.log('response', response);
    return response;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch user');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    const response = await authService.logout();
    return response;
  } catch (error: any) {
    throw new Error(error.message || 'Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: state => {
      state.user = null;
      state.isInitialized = true;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Register
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isInitialized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
        state.isInitialized = true;
      })
      // Login
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isInitialized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        state.isInitialized = true;
      })
      // Get Me
      .addCase(getMe.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        console.log('action.payload', action.payload);
        state.loading = false;
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
        state.isInitialized = true;
      })
      // Logout
      .addCase(logout.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.isInitialized = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Logout failed';
        state.isInitialized = true;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
