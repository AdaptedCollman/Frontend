/// <reference types="vite/client" />

import axios from "axios";
import { authService } from "../services/authService";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

// Request interceptor
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const newAccessToken = await authService.refreshAccessToken();

        if (newAccessToken) {
          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          // Retry the original request
          return instance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, logout the user
        authService.logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
