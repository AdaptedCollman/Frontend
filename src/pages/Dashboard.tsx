import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography } from "@mui/material";
import {
  ArrowRight,
  Languages,
  BookOpen,
  Calculator,
  Target,
  Brain,
  BarChart3,
  PieChart,
  Activity,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import {
  ScoreProgressChart,
  SectionPerformanceChart,
  EmptyChartState,
} from "../components/DashboardCharts";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";

interface TestStats {
  averageScore: string;
  totalQuestions: number;
  averageDuration: string;
  scores: number[];
  recentActivity: Array<{
    id: string;
    date: string;
    score: number;
    duration: number;
  }>;
  performanceTrend: "improving" | "declining" | "stable";
  bestScore: number;
  worstScore: number;
  totalTests: number;
  sectionStats: {
    verbal: { correct: number; total: number; percentage: number };
    quantitative: { correct: number; total: number; percentage: number };
    english: { correct: number; total: number; percentage: number };
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [testStats, setTestStats] = useState<TestStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/tests/stats/${user?.id}`);
        setTestStats(res.data);
      } catch (err) {
        console.error("Failed to fetch test statistics", err);
      } finally {
        setLoading(false);
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

  const getScoreColor = (score: number) => {
    if (score < 400) return "text-red-600";
    if (score < 600) return "text-yellow-600";
    return "text-green-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score < 400) return "bg-red-50";
    if (score < 600) return "bg-yellow-50";
    return "bg-green-50";
  };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  // Prepare data for charts
  const scoresData = testStats?.scores.map((score, i) => ({
    name: `Test ${i + 1}`,
    score,
    date: testStats.recentActivity[i]?.date || new Date().toISOString(),
  })) || [];

  const sectionData = testStats ? [
    { name: 'Verbal (Hebrew)', value: testStats.sectionStats.verbal.percentage, color: '#3B82F6' },
    { name: 'Quantitative (Math)', value: testStats.sectionStats.quantitative.percentage, color: '#10B981' },
    { name: 'English', value: testStats.sectionStats.english.percentage, color: '#F59E0B' },
  ] : [];



  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex justify-center items-center">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <div className="text-xl font-semibold text-gray-700">Loading dashboard...</div>
          </div>
        </main>
      </div>
    );
  }

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
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Overall Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Target className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Average Score
                    </Typography>
                    <Typography variant="h4" className={`font-bold ${getScoreColor(parseFloat(testStats?.averageScore || "0"))}`}>
                      {testStats?.averageScore || "0"}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      Range: 200-800
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
                      Total Tests
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {testStats?.totalTests || 0}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {testStats?.totalQuestions || 0} questions
                    </Typography>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Trophy className="text-green-600" size={24} />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Best Score
                    </Typography>
                    <Typography variant="h4" className={`font-bold ${getScoreColor(testStats?.bestScore || 0)}`}>
                      {testStats?.bestScore || 0}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      Personal record
                    </Typography>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Avg Duration
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {testStats?.averageDuration || "0s"}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      Per test
                    </Typography>
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Progress Chart */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="text-purple-600" size={24} />
                    <Typography variant="h6" className="font-bold">
                      Score Progress
                    </Typography>
                  </div>
                </div>
                {scoresData.length > 0 ? (
                  <div className="h-80">
                    <ScoreProgressChart data={scoresData} />
                  </div>
                ) : (
                  <EmptyChartState
                    icon={BarChart3}
                    title="No test data available"
                    subtitle="Complete your first test to see progress"
                  />
                )}
              </Card>

              {/* Section Performance Chart */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <PieChart className="text-blue-600" size={24} />
                    <Typography variant="h6" className="font-bold">
                      Section Performance
                    </Typography>
                  </div>
                </div>
                {sectionData.length > 0 ? (
                  <SectionPerformanceChart data={sectionData} />
                ) : (
                  <EmptyChartState
                    icon={PieChart}
                    title="No section data available"
                    subtitle="Complete tests to see section breakdown"
                  />
                )}
              </Card>
            </div>

            {/* Section Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  name: "Verbal Reasoning", 
                  subtitle: "Hebrew", 
                  icon: Languages, 
                  color: "blue",
                  stats: testStats?.sectionStats.verbal 
                },
                { 
                  name: "Quantitative", 
                  subtitle: "Math", 
                  icon: Calculator, 
                  color: "green",
                  stats: testStats?.sectionStats.quantitative 
                },
                { 
                  name: "English", 
                  subtitle: "English", 
                  icon: BookOpen, 
                  color: "orange",
                  stats: testStats?.sectionStats.english 
                }
              ].map((section) => {
                const IconComponent = section.icon;
                const getColorClasses = (color: string) => {
                  switch (color) {
                    case "blue": return { bg: "bg-blue-50", icon: "text-blue-600", progress: "bg-blue-600" };
                    case "green": return { bg: "bg-green-50", icon: "text-green-600", progress: "bg-green-600" };
                    case "orange": return { bg: "bg-orange-50", icon: "text-orange-600", progress: "bg-orange-600" };
                    default: return { bg: "bg-gray-50", icon: "text-gray-600", progress: "bg-gray-600" };
                  }
                };
                const colors = getColorClasses(section.color);

                return (
                  <Card key={section.name} className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${colors.bg}`}>
                        <IconComponent className={colors.icon} size={24} />
                      </div>
                      <div>
                        <Typography variant="h6" className="font-bold">
                          {section.name}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {section.subtitle}
                        </Typography>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Accuracy</span>
                        <span className={`font-bold ${getScoreColor(section.stats?.percentage || 0)}`}>
                          {section.stats?.percentage || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors.progress}`}
                          style={{ width: `${section.stats?.percentage || 0}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {section.stats?.correct || 0} / {section.stats?.total || 0} correct
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/${section.subtitle.toLowerCase()}`)}
                      className="w-full cursor-pointer mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex justify-center items-center gap-2 transition-colors"
                    >
                      Practice {section.name}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </Card>
                );
              })}
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-purple-600" size={24} />
                <Typography variant="h6" className="font-bold">
                  Recent Activity
                </Typography>
              </div>
              
              {testStats?.recentActivity && testStats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {testStats.recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getScoreBgColor(activity.score)}`}>
                          {activity.score >= 600 ? (
                            <CheckCircle className="text-green-600" size={20} />
                          ) : activity.score >= 400 ? (
                            <AlertTriangle className="text-yellow-600" size={20} />
                          ) : (
                            <AlertTriangle className="text-red-600" size={20} />
                          )}
                        </div>
                        <div>
                          <Typography variant="subtitle1" className="font-semibold">
                            Test #{testStats.totalTests - index}
                          </Typography>
                          <Typography variant="caption" className="text-gray-500">
                            {formatDate(activity.date)}
                          </Typography>
                        </div>
                      </div>
                      <div className="text-right">
                        <Typography variant="h6" className={`font-bold ${getScoreColor(activity.score)}`}>
                          {activity.score}
                        </Typography>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock size={14} />
                          {formatDuration(activity.duration)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="mx-auto mb-4" size={48} />
                  <p>No recent activity</p>
                  <p className="text-sm">Complete your first test to see activity</p>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <Typography variant="h6" className="font-bold mb-4">
                Quick Actions
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate("/simulations")}
                  className="p-4 cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg flex items-center gap-3 transition-colors"
                >
                  <Target className="text-white" size={24} />
                  <div className="text-left">
                    <div className="font-semibold">Full Simulation</div>
                    <div className="text-sm opacity-90">Complete psychometric exam</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/hebrew")}
                  className="p-4  cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg flex items-center gap-3 transition-colors"
                >
                  <Languages className="text-white" size={24} />
                  <div className="text-left">
                    <div className="font-semibold">Hebrew Practice</div>
                    <div className="text-sm opacity-90">Verbal reasoning</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/math")}
                  className="p-4 cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg flex items-center gap-3 transition-colors"
                >
                  <Calculator className="text-white" size={24} />
                  <div className="text-left">
                    <div className="font-semibold">Math Practice</div>
                    <div className="text-sm opacity-90">Quantitative reasoning</div>
                  </div>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
