import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

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

interface AuthResponse {
  token: string;
  user: {
    profileImage: string | null | undefined;
    hasCompletedOnboarding: boolean;
    profileImage: string | null | undefined;
    hasCompletedOnboarding: boolean;
    id: string;
    name: string;
    email: string;
  };
  message: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
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
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  getUser(): any {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async completeOnboarding(): Promise<void> {
    try {
      const response = await axios.post(`${API_URL}/complete-onboarding`);
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
  }): Promise<any> {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};
