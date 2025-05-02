import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/button";
import SubjectCard from "../components/dashboard/SubjectCard";
import {
  Card,
  Typography,
  Box,
  LinearProgress,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Award,
  Users,
  Search,
  Bell,
  ArrowRight,
  Languages,
  BookOpen,
  Calculator,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data (replace with real data later)
  const stats = {
    avgQuizScore: {
      value: 85,
      change: 5.2,
      trend: "up",
    },
    timeSpent: {
      total: "45h 30m",
      weekly: "12h 15m",
      change: 2.8,
    },
    weeklyStreak: {
      days: 5,
      total: 7,
      change: -1,
    },
    globalRank: {
      rank: 256,
      percentile: 92,
      change: 3.4,
    },
  };

  // Mock subject data
  const subjects = [
    {
      name: "Hebrew",
      icon: <Languages className="text-blue-600" size={24} />,
      level: "Intermediate",
      progress: 65,
      trend: {
        value: 8.2,
        direction: "up" as const,
      },
      action: {
        label: "Continue Learning",
        onClick: () => navigate("/subjects/hebrew"),
      },
    },
    {
      name: "English",
      icon: <BookOpen className="text-purple-600" size={24} />,
      level: "Advanced",
      progress: 82,
      trend: {
        value: 4.5,
        direction: "up" as const,
      },
      action: {
        label: "Practice Now",
        onClick: () => navigate("/subjects/english"),
      },
    },
    {
      name: "Math",
      icon: <Calculator className="text-green-600" size={24} />,
      level: "Beginner",
      progress: 35,
      trend: {
        value: 2.1,
        direction: "down" as const,
      },
      action: {
        label: "Start Next Lesson",
        onClick: () => navigate("/subjects/math"),
      },
    },
  ];

  // Mock onboarding status (replace with real data later)
  const needsOnboarding = true;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex justify-between items-center px-8 py-4">
            <Typography variant="h5" className="font-bold text-gray-900">
              Dashboard
            </Typography>
            <div className="flex items-center gap-4">
              <IconButton className="text-gray-600">
                <Search size={20} />
              </IconButton>
              <IconButton className="text-gray-600">
                <Bell size={20} />
              </IconButton>
              <div className="flex items-center gap-3">
                <Avatar>{user?.name?.[0] || "U"}</Avatar>
                <div>
                  <Typography variant="subtitle2" className="font-medium">
                    {user?.name || "User Name"}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    Student
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="p-8">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 4,
            }}
          >
            {/* Stat Cards */}
            <Box
              sx={{ gridColumn: { xs: "span 12", md: "span 6", lg: "span 3" } }}
            >
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Typography
                      variant="subtitle2"
                      className="text-gray-600 mb-1"
                    >
                      Avg Quiz Score
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {stats.avgQuizScore.value}%
                    </Typography>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      stats.avgQuizScore.trend === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats.avgQuizScore.trend === "up" ? (
                      <TrendingUp size={20} />
                    ) : (
                      <TrendingDown size={20} />
                    )}
                    <span className="text-sm font-medium">
                      {stats.avgQuizScore.change}%
                    </span>
                  </div>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={stats.avgQuizScore.value}
                  className="h-1.5 rounded-full"
                  sx={{
                    backgroundColor: "#E5E7EB",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#3461FF",
                    },
                  }}
                />
              </Card>
            </Box>

            <Box
              sx={{ gridColumn: { xs: "span 12", md: "span 6", lg: "span 3" } }}
            >
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Typography
                      variant="subtitle2"
                      className="text-gray-600 mb-1"
                    >
                      Time Spent
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {stats.timeSpent.weekly}
                    </Typography>
                  </div>
                  <Clock size={24} className="text-purple-500" />
                </div>
                <Typography variant="body2" className="text-gray-500">
                  Total: {stats.timeSpent.total}
                </Typography>
                <div className="flex items-center gap-1 mt-2 text-green-600">
                  <TrendingUp size={16} />
                  <span className="text-sm">+{stats.timeSpent.change}%</span>
                </div>
              </Card>
            </Box>

            <Box
              sx={{ gridColumn: { xs: "span 12", md: "span 6", lg: "span 3" } }}
            >
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Typography
                      variant="subtitle2"
                      className="text-gray-600 mb-1"
                    >
                      Weekly Streak
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {stats.weeklyStreak.days}/{stats.weeklyStreak.total}
                    </Typography>
                  </div>
                  <Award size={24} className="text-yellow-500" />
                </div>
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: stats.weeklyStreak.total }).map(
                    (_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i < stats.weeklyStreak.days
                            ? "bg-yellow-500"
                            : "bg-gray-200"
                        }`}
                      />
                    )
                  )}
                </div>
              </Card>
            </Box>

            <Box
              sx={{ gridColumn: { xs: "span 12", md: "span 6", lg: "span 3" } }}
            >
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Typography
                      variant="subtitle2"
                      className="text-gray-600 mb-1"
                    >
                      Global Rank
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      #{stats.globalRank.rank}
                    </Typography>
                  </div>
                  <Users size={24} className="text-blue-500" />
                </div>
                <Typography variant="body2" className="text-gray-500">
                  Top {stats.globalRank.percentile}th percentile
                </Typography>
                <div className="flex items-center gap-1 mt-2 text-green-600">
                  <TrendingUp size={16} />
                  <span className="text-sm">
                    +{stats.globalRank.change} positions
                  </span>
                </div>
              </Card>
            </Box>

            {/* Learning Sections */}
            <Box sx={{ gridColumn: "span 12" }}>
              <Typography variant="h6" className="font-bold text-gray-900 mb-4">
                Learning Sections
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <SubjectCard key={subject.name} {...subject} />
                ))}
              </div>
            </Box>

            {/* Onboarding Card - Show only if needed */}
            {needsOnboarding && (
              <Box sx={{ gridColumn: "span 12" }}>
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <Typography
                        variant="h5"
                        className="font-bold text-gray-900 mb-2"
                      >
                        Complete Your Learning Profile
                      </Typography>
                      <Typography
                        variant="body1"
                        className="text-gray-600 max-w-2xl"
                      >
                        Help us personalize your learning experience by
                        answering a few quick questions
                      </Typography>
                    </div>
                    <Button
                      onClick={() => navigate("/onboarding")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-lg shadow-sm"
                    >
                      <span>Start My Learning Profile Wizard</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              </Box>
            )}

            {/* Chart Section - Placeholder for now */}
            <Box sx={{ gridColumn: "span 12" }}>
              <Card className="p-6">
                <Typography variant="h6" className="mb-4">
                  Monthly Progress
                </Typography>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <Typography variant="body2" className="text-gray-500">
                    Chart will be implemented in the next step
                  </Typography>
                </div>
              </Card>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
