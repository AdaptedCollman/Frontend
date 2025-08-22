import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

interface SubjectStats {
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number;
  level: number;
  progress: number;
}

interface UserStats {
  userId: string;
  subjects: {
    english: SubjectStats;
    hebrew: SubjectStats;
    math: SubjectStats;
  };
  totalQuestions: number;
  totalCorrect: number;
  totalTimeSpent: number;
  weeklyStreak: number;
}

interface StatsContextType {
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  refetchStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = `${baseUrl}/api/user-stats/${user?.id}`;

    console.log("Fetching stats for user:", user?.id, "URL:", url);
    if (!user || !user.id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(url);
      console.log("Stats response:", response);
      if (!response.data || !response.data.userId || !response.data.subjects) {
        console.error("[StatsContext] Invalid stats response:", response.data);
        setStats(null);
        setError("No stats data received from backend.");
      } else {
        setStats(response.data);
        setError(null);
        console.log("[StatsContext] Stats set:", response.data);
      }
    } catch (err) {
      console.error("[StatsContext] Axios error:", err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch stats (axios error)"
        );
      } else {
        setError("Failed to fetch stats (unknown error)");
      }
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchStats();
    }
  }, [user?.id]);

  return (
    <StatsContext.Provider
      value={{ stats, isLoading, error, refetchStats: fetchStats }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
};
