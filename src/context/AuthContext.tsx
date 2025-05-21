import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

interface User {
  id: string;
  name: string;
  email: string;
  hasCompletedOnboarding: boolean;
  currentLevel: number;
  profileImage?: string | null;
}

interface UpdateUserData {
  name?: string;
  profileImage?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => Promise<void>;
  updateUser: (data: UpdateUserData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getUser();
        if (storedUser && (await authService.verifyToken())) {
          setUser({ ...storedUser, hasCompletedOnboarding: true });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser({ ...response.user, hasCompletedOnboarding: true });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      const response = await authService.register({
        name,
        email,
        password,
        confirmPassword,
      });
      setUser({ ...response.user, hasCompletedOnboarding: true });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const completeOnboarding = async () => {
    try {
      await authService.completeOnboarding();
      setUser((prevUser) =>
        prevUser ? { ...prevUser, hasCompletedOnboarding: true } : null
      );
    } catch (error) {
      console.error("Complete onboarding error:", error);
      throw error;
    }
  };

  const updateUser = async (data: UpdateUserData) => {
    try {
      const updatedUser = await authService.updateUser(data);
      setUser(updatedUser);
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    hasCompletedOnboarding: user?.hasCompletedOnboarding ?? false,
    login,
    register,
    logout,
    completeOnboarding,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
