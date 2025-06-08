import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
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
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const { login, register,isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Dialog states
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Error & loading
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  // Navbar background opacity based on scroll
  const navbarBg = useMotionTemplate`rgba(0, 0, 0, ${useTransform(scrollY, [0, 100], [0.3, 0.8])})`;

  const handleLoginOpen = () => {
    setLoginError("");
    setLoginForm({ email: "", password: "" });
    setLoginOpen(true);
  };

  const handleLoginClose = () => setLoginOpen(false);
  const handleRegisterOpen = () => {
    setRegisterError("");
    setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" });
    setRegisterOpen(true);
  };
  const handleRegisterClose = () => setRegisterOpen(false);

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError("");
    setIsLoginLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      handleLoginClose();
      navigate("/dashboard");
    } catch (error: any) {
      setLoginError(error.message || "Login failed. Please try again.");
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
      await register(
        registerForm.name,
        registerForm.email,
        registerForm.password,
        registerForm.confirmPassword
      );
      handleRegisterClose();
      navigate("/dashboard");
    } catch (error: any) {
      setRegisterError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsRegisterLoading(false);
    }
  };

  // Hide navbar in certain routes if needed

  const hideNavbar = ["/dashboard"].includes(location.pathname) || ["/profile"].includes(location.pathname);

  if (hideNavbar) return null;


  return (
    <motion.div
      style={{ background: navbarBg }}
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-200 backdrop-blur-sm"
    >
      <AppBar position="static" elevation={0} className="!bg-transparent">
        <Toolbar className="container mx-auto px-4">
          <div className="flex-grow">
            <span className="text-2xl font-bold text-white">
              Adapt<span className="text-[#3461FF]">ED</span>
            </span>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            <Button variant="text" onClick={handleLoginOpen} className="!text-white !font-medium hover:!bg-white/10">
              LOGIN
            </Button>
            <Button variant="outlined" onClick={handleRegisterOpen} className="!text-white !border-white hover:!bg-white/10">
              REGISTER
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* Login Dialog */}
      <Dialog open={loginOpen} onClose={handleLoginClose} maxWidth="xs" fullWidth>
        <DialogTitle className="flex justify-between items-center bg-gray-50">
          <span className="font-semibold text-gray-800">Login</span>
          <IconButton onClick={handleLoginClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleLoginSubmit}>
          <DialogContent className="!pt-6">
            {loginError && <Alert severity="error" className="mb-4">{loginError}</Alert>}
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
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
          </DialogContent>
          <DialogActions className="p-6 bg-gray-50">
            <Button type="submit" variant="contained" fullWidth className="!bg-[#3461FF] hover:!bg-blue-700" disabled={isLoginLoading}>
              {isLoginLoading ? "Logging in..." : "Login"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Register Dialog */}
      <Dialog open={registerOpen} onClose={handleRegisterClose} maxWidth="xs" fullWidth>
        <DialogTitle className="flex justify-between items-center bg-gray-50">
          <span className="font-semibold text-gray-800">Register</span>
          <IconButton onClick={handleRegisterClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleRegisterSubmit}>
          <DialogContent className="!pt-6">
            {registerError && <Alert severity="error" className="mb-4">{registerError}</Alert>}
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
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
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
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
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
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              required
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
            />
          </DialogContent>
          <DialogActions className="p-6 bg-gray-50">
            <Button type="submit" variant="contained" fullWidth className="!bg-[#3461FF] hover:!bg-blue-700" disabled={isRegisterLoading}>
              {isRegisterLoading ? "Registering..." : "Register"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </motion.div>
  );
};

export default Navbar;
