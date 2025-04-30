import React, { useRef, useState } from "react";
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
} from "@mui/material";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import HeroSection from "../components/sections/HeroSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";

const LandingPage = () => {
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Navbar background opacity based on scroll
  const navbarBg = useMotionTemplate`rgba(0, 0, 0, ${useTransform(
    scrollY,
    [0, 100],
    [0.3, 0.8]
  )})`;

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);
  const handleRegisterOpen = () => setRegisterOpen(true);
  const handleRegisterClose = () => setRegisterOpen(false);

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleLoginClose();
  };

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleRegisterClose();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Semi-transparent Navbar */}
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
              <Button
                variant="contained"
                className="!bg-[#3461FF] hover:!bg-blue-700 !px-6 !py-2"
              >
                START TEST
              </Button>
              <Button
                variant="text"
                onClick={handleLoginOpen}
                className="!text-white !font-medium hover:!bg-white/10"
              >
                LOGIN
              </Button>
              <Button
                variant="outlined"
                onClick={handleRegisterOpen}
                className="!text-white !border-white hover:!bg-white/10"
              >
                REGISTER
              </Button>
            </div>
          </Toolbar>
        </AppBar>
      </motion.div>

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
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              required
              className="mb-4"
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              required
            />
          </DialogContent>
          <DialogActions className="p-6 bg-gray-50">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="!bg-[#3461FF] hover:!bg-blue-700"
            >
              Login
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
            <TextField
              autoFocus
              margin="dense"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              required
              className="mb-4"
            />
            <TextField
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              required
              className="mb-4"
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              required
              className="mb-4"
            />
            <TextField
              margin="dense"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              required
            />
          </DialogContent>
          <DialogActions className="p-6 bg-gray-50">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="!bg-[#3461FF] hover:!bg-blue-700"
            >
              Register
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default LandingPage;
