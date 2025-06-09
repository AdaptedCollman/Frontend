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
import Mission from "./pages/FooterPages/Mission";
import HelpCenter from "./pages/FooterPages/HelpCenter";
import Contact from "./pages/FooterPages/Contact";
import Privacy from "./pages/FooterPages/Privacy";
import Terms from "./pages/FooterPages/Terms";
import Team from "./pages/FooterPages/Team";
import Careers from "./pages/FooterPages/Careers";
import FAQ from "./pages/FooterPages/FAQ";
import Cookies from "./pages/FooterPages/Cookies";
import LearningAdvisor from "./pages/LearningAdvisor";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import ProfilePage from "./pages/ProfilePage";
import SimulationPage from "./pages/SimulationPage";
import { SimulationProvider } from "./context/SimulationContext";

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
    <SimulationProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </SimulationProvider>
  </AuthProvider>
);

export default App;
