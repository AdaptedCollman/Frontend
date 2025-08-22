import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL; // נקרא מה־env
const API_URL = `${API_BASE}/api/auth`;

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  hasCompletedOnboarding?: boolean;
  profileImage?: string | null;
  currentLevel?: number;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    profileImage?: string | null;
    hasCompletedOnboarding?: boolean;
    currentLevel?: number;
  };
  message: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      if (response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      console.log("✅ login response:", response.data);

      const { accessToken, refreshToken, user } = response.data;

      if (accessToken && refreshToken && user) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("✅ tokens and user saved to localStorage");
      } else {
        console.warn("⚠️ Login response missing tokens or user");
      }

      return {
        accessToken,
        refreshToken,
        user,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("❌ Login error:", error.response?.data || error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return null;

      const response = await axios.post(`${API_URL}/refresh-token`, {
        refreshToken,
      });

      const { accessToken } = response.data;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        return accessToken;
      }
      return null;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      this.logout();
      return null;
    }
  },

  async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return false;

      const response = await axios.get(`${API_URL}/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return !!response.data.user;
    } catch {
      return false;
    }
  },

  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  getToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },

  getUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async completeOnboarding(): Promise<void> {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_URL}/complete-onboarding`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to complete onboarding"
      );
    }
  },

  async updateUser(data: {
    name?: string;
    profileImage?: string | null;
    phone?: string;
  }): Promise<User> {
    try {
      const token = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user.id) {
        throw new Error("User ID is missing from localStorage");
      }

      const response = await axios.put(
        `${API_BASE}/api/users/${user.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};
