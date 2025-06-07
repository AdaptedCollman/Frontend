import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Card, Typography, Box } from "@mui/material";
import axios from "../utils/axios";
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
import { useAuth } from "../context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [testStats, setTestStats] = useState<{
    averageScore: string;
    totalQuestions: number;
    averageDuration: string;
    scores: number[];
  } | null>(null);

  useEffect(() => {
    const fetchTestStats = async () => {
      try {
        const res = await axios.get(`/api/tests/stats/${user?.id}`);
        setTestStats(res.data);
      } catch (err) {
        console.error("Failed to fetch test statistics", err);
      }
    };

    if (user?.id) {
      fetchTestStats();
    }
  }, [user?.id]);

  if (!user || !user.id) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex justify-center items-center">
          <div className="text-xl font-semibold text-gray-700">Loading user...</div>
        </main>
      </div>
    );
  }

  const scoresData =
    testStats?.scores.map((score, i) => ({
      name: `Test ${i + 1}`,
      score,
    })) || [];

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
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      {testStats?.averageScore ?? "0.0"}%
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
                      {testStats?.totalQuestions ?? 0}
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
                      Average Duration
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {testStats?.averageDuration ?? "0s"}
                    </Typography>
                  </div>
                </div>
              </Card>
            </div>

            {/* Score Chart */}
            {scoresData.length > 0 && (
              <div className="w-full h-64 my-10 bg-white rounded-lg shadow">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={scoresData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6366F1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Subject Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {["Hebrew", "English", "Math"].map((name) => {
                const icon =
                  name === "Hebrew" ? (
                    <Languages className="text-blue-600" size={24} />
                  ) : name === "English" ? (
                    <BookOpen className="text-purple-600" size={24} />
                  ) : (
                    <Calculator className="text-green-600" size={24} />
                  );

                return (
                  <Card key={name} className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        {icon}
                        <Typography variant="h6" className="font-bold">
                          {name}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={20} className="text-gray-300" />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => navigate(`/${name.toLowerCase()}`)}
                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex justify-center items-center gap-2"
                      >
                        Go practice {name}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
