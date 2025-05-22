import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import EnglishQuizPage from "./pages/EnglishQuizPage";
import MathQuizPage from "./pages/MathQuizPage";
import HebrewQuizPage from "./pages/HebrewQuizPage";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Mission from "./pages/Mission";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Team from "./pages/Team";
import Careers from "./pages/Careers";
import FAQ from "./pages/FAQ";
import Cookies from "./pages/Cookies";
import LearningAdvisor from "./pages/LearningAdvisor";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import ProfilePage from "./pages/ProfilePage";
import ChatWizard from "./components/onboarding/ChatWizard";
import SimulationPage from "./pages/SimulationPage";

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const sidebarRoutes = [
  "/dashboard",
  "/english",
  "/hebrew",
  "/math",
  "/simulations",
  "/learning-advisor",
];

const AppContent = () => {
  const location = useLocation();
  const showNavbar = !sidebarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LandingPage />} />

          {/* Footer pages */}
          <Route path="/mission" element={<Mission />} />
          <Route path="/team" element={<Team />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />

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
          <Route
            path="/learning-advisor"
            element={
              <ProtectedRoute>
                <LearningAdvisor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulations"
            element={
              <ProtectedRoute>
                <SimulationPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
