import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import EnglishQuizPage from "./pages/EnglishQuizPage";
import MathQuizPage from "./pages/MathQuizPage";
import HebrewQuizPage from "./pages/HebrewQuizPage";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProfilePage from "./pages/ProfilePage";
import ChatWizard from "./components/onboarding/ChatWizard";

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <Routes>
                {/* Public route */}
                <Route path="/" element={<LandingPage />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/english"
                  element={
                    <ProtectedRoute>
                      <EnglishQuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/math"
                  element={
                    <ProtectedRoute>
                      <MathQuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hebrew"
                  element={
                    <ProtectedRoute>
                      <HebrewQuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/advisor"
                  element={
                    <ProtectedRoute>
                      <ChatWizard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
