import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChatWizard from "./components/onboarding/ChatWizard";
import InitialTest from "./pages/InitialTest";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Onboarding Route wrapper
const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
              {/* Public route */}
              <Route path="/" element={<LandingPage />} />

              {/* Protected routes */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <ChatWizard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/initial-test"
                element={
                  <ProtectedRoute>
                    <InitialTest />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <OnboardingRoute>
                    <Dashboard />
                  </OnboardingRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
