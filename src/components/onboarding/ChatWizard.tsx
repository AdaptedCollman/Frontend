import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TextField,
  Button,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Rating,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Message {
  id: number;
  text: string;
  type: "bot" | "user";
  inputType?: "text" | "select" | "multiSelect" | "scale" | "rating";
  options?: string[];
  required?: boolean;
}

interface UserResponses {
  subjects: string[];
  averageGrades: string;
  selfRating: {
    math: number;
    verbal: number;
    logic: number;
  };
  targetUniversity: string;
}

const initialResponses: UserResponses = {
  subjects: [],
  averageGrades: "",
  selfRating: {
    math: 3,
    verbal: 3,
    logic: 3,
  },
  targetUniversity: "",
};

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "History",
];

const ChatWizard: React.FC = () => {
  const { user, isAuthenticated, hasCompletedOnboarding, completeOnboarding } =
    useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] =
    useState<UserResponses>(initialResponses);
  const [currentInput, setCurrentInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const questions: Message[] = [
    {
      id: 1,
      text: "Hi! I'm your AdaptED assistant. Let's personalize your learning experience. First, what subjects would you like to study?",
      type: "bot",
      inputType: "multiSelect",
      options: subjects,
      required: true,
    },
    {
      id: 2,
      text: "Great choices! What's your average grade range in high school?",
      type: "bot",
      inputType: "select",
      options: [
        "A (90-100%)",
        "B (80-89%)",
        "C (70-79%)",
        "D (60-69%)",
        "Below 60%",
      ],
      required: true,
    },
    {
      id: 3,
      text: "On a scale of 1-5, how would you rate your math skills?",
      type: "bot",
      inputType: "rating",
      required: true,
    },
    {
      id: 4,
      text: "How about your verbal reasoning skills?",
      type: "bot",
      inputType: "rating",
      required: true,
    },
    {
      id: 5,
      text: "And your logical reasoning skills?",
      type: "bot",
      inputType: "rating",
      required: true,
    },
    {
      id: 6,
      text: "What type of university or program are you aiming for?",
      type: "bot",
      inputType: "text",
      required: true,
    },
  ];

  useEffect(() => {
    // Redirect if user is not authenticated or has already completed onboarding
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    if (hasCompletedOnboarding) {
      navigate("/dashboard");
      return;
    }
  }, [isAuthenticated, hasCompletedOnboarding, navigate]);

  useEffect(() => {
    // Show initial message with delay
    setTimeout(() => {
      setMessages([questions[0]]);
    }, 500);
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleResponse = async (response: any) => {
    // Add user response to messages
    const userMessage: Message = {
      id: Date.now(),
      text: Array.isArray(response) ? response.join(", ") : response.toString(),
      type: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    // Update user responses based on current step
    switch (currentStep) {
      case 0:
        setUserResponses((prev) => ({ ...prev, subjects: response }));
        break;
      case 1:
        setUserResponses((prev) => ({ ...prev, averageGrades: response }));
        break;
      case 2:
        setUserResponses((prev) => ({
          ...prev,
          selfRating: { ...prev.selfRating, math: response },
        }));
        break;
      case 3:
        setUserResponses((prev) => ({
          ...prev,
          selfRating: { ...prev.selfRating, verbal: response },
        }));
        break;
      case 4:
        setUserResponses((prev) => ({
          ...prev,
          selfRating: { ...prev.selfRating, logic: response },
        }));
        break;
      case 5:
        setUserResponses((prev) => ({ ...prev, targetUniversity: response }));
        break;
    }

    // Move to next question after delay
    setTimeout(async () => {
      if (currentStep < questions.length - 1) {
        setMessages((prev) => [...prev, questions[currentStep + 1]]);
        setCurrentStep((prev) => prev + 1);
        setCurrentInput("");
      } else {
        // Show completion message and mark onboarding as complete
        const completionMessage: Message = {
          id: Date.now() + 1,
          text: "Great! Based on your responses, I'll set up your personalized learning path. Let's start with an initial assessment to determine your current level.",
          type: "bot",
        };
        setMessages((prev) => [...prev, completionMessage]);

        try {
          // Store responses and complete onboarding
          await completeOnboarding();
          // Redirect after delay
          setTimeout(() => {
            navigate("/initial-test");
          }, 3000);
        } catch (error) {
          console.error("Error completing onboarding:", error);
          // Add error message to chat
          const errorMessage: Message = {
            id: Date.now() + 2,
            text: "There was an error saving your responses. Please try again.",
            type: "bot",
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      }
    }, 1000);
  };

  const renderInput = (message: Message) => {
    switch (message.inputType) {
      case "multiSelect":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mt-4"
          >
            {message.options?.map((option) => (
              <Chip
                key={option}
                label={option}
                onClick={() => {
                  const newSubjects = userResponses.subjects.includes(option)
                    ? userResponses.subjects.filter((s) => s !== option)
                    : [...userResponses.subjects, option];
                  setUserResponses((prev) => ({
                    ...prev,
                    subjects: newSubjects,
                  }));
                }}
                color={
                  userResponses.subjects.includes(option)
                    ? "primary"
                    : "default"
                }
                className="cursor-pointer"
              />
            ))}
            <Button
              variant="contained"
              disabled={userResponses.subjects.length === 0}
              onClick={() => handleResponse(userResponses.subjects)}
              className="ml-auto mt-4"
            >
              Continue
            </Button>
          </motion.div>
        );

      case "select":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <FormControl fullWidth>
              <InputLabel>Select Grade Range</InputLabel>
              <Select
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                label="Select Grade Range"
              >
                {message.options?.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                disabled={!currentInput}
                onClick={() => handleResponse(currentInput)}
                className="mt-4"
              >
                Continue
              </Button>
            </FormControl>
          </motion.div>
        );

      case "rating":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <Rating
              value={Number(currentInput) || 0}
              onChange={(_, value) => setCurrentInput(value?.toString() || "0")}
              size="large"
              max={5}
            />
            <Button
              variant="contained"
              disabled={!currentInput}
              onClick={() => handleResponse(Number(currentInput))}
              className="ml-4"
            >
              Continue
            </Button>
          </motion.div>
        );

      case "text":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <TextField
              fullWidth
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your answer..."
              variant="outlined"
            />
            <Button
              variant="contained"
              disabled={!currentInput.trim()}
              onClick={() => handleResponse(currentInput)}
              className="mt-4"
            >
              Continue
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <SchoolIcon className="text-[#3461FF] text-4xl mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to Adapt<span className="text-[#3461FF]">ED</span>
          </h2>
          <p className="mt-2 text-gray-600">
            Let's personalize your learning experience
          </p>
        </div>

        {/* Chat container */}
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-[600px] flex flex-col">
          <div className="flex-grow overflow-y-auto mb-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-4 ${
                    message.type === "bot" ? "mr-auto" : "ml-auto"
                  }`}
                >
                  <div
                    className={`rounded-xl p-4 max-w-[80%] ${
                      message.type === "bot"
                        ? "bg-gray-100 text-gray-900"
                        : "bg-[#3461FF] text-white"
                    }`}
                  >
                    {message.text}
                    {message.type === "bot" &&
                      message.inputType &&
                      renderInput(message)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Progress indicator */}
          <div className="h-1 bg-gray-200 rounded-full mt-4">
            <motion.div
              className="h-full bg-[#3461FF] rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(currentStep / (questions.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWizard;
