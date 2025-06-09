import React, { useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HeroSection from "../components/sections/HeroSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Error states
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // Loading states
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLoginClose = () => {
    setLoginError("");
    setLoginOpen(false);
  };

  const handleRegisterClose = () => {
    setRegisterError("");
    setRegisterOpen(false);
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError("");
    setIsLoginLoading(true);

    try {
      await login(loginForm.email, loginForm.password);
      handleLoginClose();
      navigate("/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      setLoginError(errorMessage);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegisterError("");
    setIsRegisterLoading(true);

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError("Passwords do not match");
      setIsRegisterLoading(false);
      return;
    }

    try {
      // First register the user
      await register(
        registerForm.name,
        registerForm.email,
        registerForm.password,
        registerForm.confirmPassword
      );

      // Then automatically log them in
      await login(registerForm.email, registerForm.password);

      handleRegisterClose();
      navigate("/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      setRegisterError(errorMessage);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection onHowItWorksClick={scrollToHowItWorks} />

      {/* How It Works Section */}
      <div ref={howItWorksRef}>
        <HowItWorksSection />
      </div>

      {/* Login Dialog */}
      <Dialog
        open={loginOpen}
        onClose={handleLoginClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center bg-gray-50">
          <span className="font-semibold text-gray-800">Login</span>
          <IconButton onClick={handleLoginClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleLoginSubmit}>
          <DialogContent className="!pt-6">
            {loginError && (
              <Alert severity="error" className="mb-4">
                {loginError}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              required
              className="mb-4"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              required
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions className="p-6 bg-gray-50">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="!bg-[#3461FF] hover:!bg-blue-700"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? "Logging in..." : "Login"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Register Dialog */}
      <Dialog
        open={registerOpen}
        onClose={handleRegisterClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center bg-gray-50">
          <span className="font-semibold text-gray-800">Register</span>
          <IconButton onClick={handleRegisterClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleRegisterSubmit}>
          <DialogContent className="!pt-6">
            {registerError && (
              <Alert severity="error" className="mb-4">
                {registerError}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              required
              className="mb-4"
              value={registerForm.name}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              required
              className="mb-4"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              required
              className="mb-4"
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              required
              value={registerForm.confirmPassword}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  confirmPassword: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions className="p-6 bg-gray-50">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="!bg-[#3461FF] hover:!bg-blue-700"
              disabled={isRegisterLoading}
            >
              {isRegisterLoading ? "Registering..." : "Register"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default LandingPage;
