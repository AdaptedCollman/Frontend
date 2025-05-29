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
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user-stats/${user.id}`
      );
      setStats(response.data);
    } catch (err) {
      console.error("Stats error:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch stats");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
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
