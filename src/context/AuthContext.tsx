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

interface AuthResponseUser {
  id: string;
  name: string;
  email: string;
  hasCompletedOnboarding?: boolean;
  currentLevel?: number;
  profileImage?: string | null;
}

interface UpdateUserData {
  name?: string;
  profileImage?: string | null;
  phone?: string;
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

  // ✅ טוען את המשתמש מה־localStorage אם יש טוקן חוקי
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getUser();
        const isValid = await authService.verifyToken();
        if (storedUser && isValid) {
          setUser({
            id: storedUser.id,
            name: storedUser.name,
            email: storedUser.email,
            hasCompletedOnboarding: storedUser.hasCompletedOnboarding ?? false,
            currentLevel: storedUser.currentLevel ?? 1,
            profileImage: storedUser.profileImage,
          });
          console.log("[AuthContext] User loaded from storage:", storedUser);
        } else {
          authService.logout();
          setUser(null);
          console.log("[AuthContext] No valid token or user.");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: { user: AuthResponseUser } = await authService.login({
        email,
        password,
      });
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        hasCompletedOnboarding: response.user.hasCompletedOnboarding ?? false,
        currentLevel: response.user.currentLevel ?? 1,
        profileImage: response.user.profileImage,
      });
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
      const response: { user: AuthResponseUser } = await authService.register({
        name,
        email,
        password,
        confirmPassword,
      });
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        hasCompletedOnboarding: response.user.hasCompletedOnboarding ?? false,
        currentLevel: response.user.currentLevel ?? 1,
        profileImage: response.user.profileImage,
      });
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
        prevUser
          ? {
              ...prevUser,
              hasCompletedOnboarding: true,
            }
          : null
      );
    } catch (error) {
      console.error("Complete onboarding error:", error);
      throw error;
    }
  };

  const updateUser = async (data: UpdateUserData) => {
    try {
      const updatedUser: AuthResponseUser = await authService.updateUser(data);
      setUser({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        hasCompletedOnboarding:
          updatedUser.hasCompletedOnboarding ?? user?.hasCompletedOnboarding ?? false,
        currentLevel: updatedUser.currentLevel ?? user?.currentLevel ?? 1,
        profileImage: updatedUser.profileImage,
      });
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
