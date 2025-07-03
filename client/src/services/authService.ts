import api from "./api";

// Types
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: { id: number; name: string; email: string };
  message: string;
}

interface UserResponse {
  user: { id: number; name: string; email: string };
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/register", data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/login", data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  getMe: async (): Promise<UserResponse> => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  },
};