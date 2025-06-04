import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { Card, Typography, Box, LinearProgress } from "@mui/material";
import {
  Clock,
  Award,
  ArrowRight,
  Languages,
  BookOpen,
  Calculator,
  Star,
  Target,
  Brain,
} from "lucide-react";
import { useStats } from "../context/StatsContext";
import { useAuth } from "../context/AuthContext";

// Define the expected structure of the user stats data fetched from the backend
interface SubjectStatsData {
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number; // Stored as number in backend
  level: number;
  progress: number;
}

interface UserStatsType {
  userId: string;
  subjects: {
    english: SubjectStatsData;
    hebrew: SubjectStatsData;
    math: SubjectStatsData;
  };
  totalQuestions: number;
  totalCorrect: number;
  totalTimeSpent: number; // Stored as number in backend
  weeklyStreak: number;
}

// Interface for how subject data is structured for display in this component
interface SubjectStatsDisplay {
  name: string;
  key: keyof UserStatsType["subjects"];
  icon: React.JSX.Element;
  level: number;
  progress: number;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: string; // Calculated as a string for display
  timeSpent: string; // Formatted as a string for display
  color: string;
  label: string;
  path: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  // Type the stats from useStats hook using the locally defined UserStatsType
  const {
    stats: userStats,
    isLoading,
    error,
    refetchStats,
  } = useStats() as {
    stats: UserStatsType | null;
    isLoading: boolean;
    error: string | null;
    refetchStats: () => Promise<void>;
  };

  const navigate = useNavigate();

  // Add useEffect to fetch stats when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      refetchStats();
    }
  }, [user?.id]); // Add user.id as a dependency

  if (!user || !user.id) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex justify-center items-center">
          <div className="text-xl font-semibold text-gray-700">
            Loading user...
          </div>
        </main>
      </div>
    );
  }

  // Use defaultStats if userStats is null
  const defaultStats: UserStatsType = {
    userId: "",
    subjects: {
      english: {
        questionsAnswered: 0,
        correctAnswers: 0,
        timeSpent: 0,
        level: 1,
        progress: 0,
      },
      hebrew: {
        questionsAnswered: 0,
        correctAnswers: 0,
        timeSpent: 0,
        level: 1,
        progress: 0,
      },
      math: {
        questionsAnswered: 0,
        correctAnswers: 0,
        timeSpent: 0,
        level: 1,
        progress: 0,
      },
    },
    totalQuestions: 0,
    totalCorrect: 0,
    totalTimeSpent: 0,
    weeklyStreak: 0,
  };

  const stats = userStats || defaultStats;

  // Show error in dashboard area
  let dashboardContent = null;
  if (error) {
    dashboardContent = (
      <div className="text-xl font-semibold text-red-600 text-center mt-8">
        Error loading dashboard: {error}
      </div>
    );
  } else if (isLoading) {
    dashboardContent = (
      <div className="flex justify-center items-center h-32">
        <div className="text-xl font-semibold text-gray-700">Loading stats...</div>
      </div>
    );
  }

  // Updated formatTime to accept number, undefined, or null and return string
  const formatTime = (seconds: number | undefined | null): string => {
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds <= 0) return "0h 0m";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  // Prepare subject data using the non-null userStats and SubjectStatsDisplay type
  const subjects: SubjectStatsDisplay[] = [
    {
      name: "Hebrew",
      key: "hebrew",
      icon: <Languages className="text-blue-600" size={24} />,
      level: stats.subjects.hebrew?.level ?? 1,
      progress: stats.subjects.hebrew?.progress ?? 0,
      questionsAnswered: stats.subjects.hebrew?.questionsAnswered ?? 0,
      correctAnswers: stats.subjects.hebrew?.correctAnswers ?? 0,
      accuracy: stats.subjects.hebrew?.questionsAnswered
        ? (
            ((stats.subjects.hebrew.correctAnswers ?? 0) /
              (stats.subjects.hebrew.questionsAnswered ?? 1)) *
            100
          ).toFixed(1)
        : "0.0",
      timeSpent: formatTime(stats.subjects.hebrew?.timeSpent ?? 0),
      color: "#2563EB",
      label: "Continue Learning",
      path: "/hebrew",
    },
    {
      name: "English",
      key: "english",
      icon: <BookOpen className="text-purple-600" size={24} />,
      level: stats.subjects.english?.level ?? 1,
      progress: stats.subjects.english?.progress ?? 0,
      questionsAnswered: stats.subjects.english?.questionsAnswered ?? 0,
      correctAnswers: stats.subjects.english?.correctAnswers ?? 0,
      accuracy: stats.subjects.english?.questionsAnswered
        ? (
            ((stats.subjects.english.correctAnswers ?? 0) /
              (stats.subjects.english.questionsAnswered ?? 1)) *
            100
          ).toFixed(1)
        : "0.0",
      timeSpent: formatTime(stats.subjects.english?.timeSpent ?? 0),
      color: "#9333EA",
      label: "Practice Now",
      path: "/english",
    },
    {
      name: "Math",
      key: "math",
      icon: <Calculator className="text-green-600" size={24} />,
      level: stats.subjects.math?.level ?? 1,
      progress: stats.subjects.math?.progress ?? 0,
      questionsAnswered: stats.subjects.math?.questionsAnswered ?? 0,
      correctAnswers: stats.subjects.math?.correctAnswers ?? 0,
      accuracy: stats.subjects.math?.questionsAnswered
        ? (
            ((stats.subjects.math.correctAnswers ?? 0) /
              (stats.subjects.math.questionsAnswered ?? 1)) *
            100
          ).toFixed(1)
        : "0.0",
      timeSpent: formatTime(stats.subjects.math?.timeSpent ?? 0),
      color: "#16A34A",
      label: "Start Next Lesson",
      path: "/math",
    },
  ];

  // Calculate overall accuracy using the non-null userStats
  const overallAccuracy = stats.totalQuestions
    ? ((stats.totalCorrect / stats.totalQuestions) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex justify-between items-center px-8 py-4">
            <Typography variant="h5" className="font-bold text-gray-900">
              Learning Dashboard
            </Typography>
          </div>
        </div>

        <div className="p-8">
          <Box sx={{ display: "grid", gap: 4 }}>
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Target className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Overall Accuracy
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {overallAccuracy}%
                    </Typography>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Brain className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Questions Answered
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {stats.totalQuestions}
                    </Typography>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Clock className="text-green-600" size={24} />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Time Spent
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {formatTime(stats.totalTimeSpent)}
                    </Typography>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Award className="text-yellow-600" size={24} />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Weekly Streak
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {stats.weeklyStreak} days
                    </Typography>
                  </div>
                </div>
              </Card>
            </div>

            {/* Subject Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <Card key={subject.name} className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {subject.icon}
                      <Typography variant="h6" className="font-bold">
                        {subject.name}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={
                            i < subject.level
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{subject.progress}%</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={subject.progress}
                        className="h-2 rounded-full"
                        sx={{
                          backgroundColor: "#E5E7EB",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: subject.color,
                          },
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <Typography
                          variant="subtitle2"
                          className="text-gray-600"
                        >
                          Questions
                        </Typography>
                        <Typography variant="h6" className="font-bold">
                          {subject.questionsAnswered}
                        </Typography>
                      </div>
                      <div>
                        <Typography
                          variant="subtitle2"
                          className="text-gray-600"
                        >
                          Accuracy
                        </Typography>
                        <Typography variant="h6" className="font-bold">
                          {subject.accuracy}%
                        </Typography>
                      </div>
                      <div>
                        <Typography
                          variant="subtitle2"
                          className="text-gray-600"
                        >
                          Time Spent
                        </Typography>
                        <Typography variant="h6" className="font-bold">
                          {subject.timeSpent}
                        </Typography>
                      </div>
                      <div>
                        <Typography
                          variant="subtitle2"
                          className="text-gray-600"
                        >
                          Level
                        </Typography>
                        <Typography variant="h6" className="font-bold">
                          {subject.level}/5
                        </Typography>
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate(subject.path)}
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      {subject.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
