import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, XCircle, Timer } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useStats } from "@/context/StatsContext";

interface Option {
  id: string;
  text: string;
}

interface QuestionData {
  id: number;
  totalQuestions: number;
  question: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
}

const HebrewQuizPage = () => {
  const { user } = useAuth();
  const { refetchStats } = useStats();

  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now()
  );
  const [hasSubmittedAutomatically, setHasSubmittedAutomatically] =
    useState(false);

  const fetchQuestion = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/questions", {
        topic: "hebrew",
        difficulty: difficultyLevel + 2,
      });

      const q = res.data;
      const correctIndex = q.answerOptions.findIndex(
        (text: string) => text === q.correctAnswer
      );
      const correctAnswerId = (correctIndex + 1).toString();
      setQuestion({
        id: 1,
        totalQuestions: 1,
        question: q.content,
        options: q.answerOptions.map((text: string, index: number) => ({
          id: (index + 1).toString(),
          text,
        })),
        correctAnswer: correctAnswerId,
        explanation: q.explanation,
      });

      setSelectedAnswer("");
      setIsSubmitted(false);
      setIsCorrect(false);
      setTimeRemaining(60);
      setQuestionStartTime(Date.now());
    } catch (err) {
      console.error("Failed to fetch question:", err);
      setQuestion(null);
    }
    setHasSubmittedAutomatically(false);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuestion();
  }, [user?.id, difficultyLevel]);

  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted && !isLoading) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }

    if (
      timeRemaining === 0 &&
      !isSubmitted &&
      !isLoading &&
      !hasSubmittedAutomatically
    ) {
      setHasSubmittedAutomatically(true);
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted, isLoading, hasSubmittedAutomatically]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (isSubmitted || !question || !user?.id) return;

    setIsSubmitted(true);
    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);

    try {
      const timeSpent = Math.max(
        1,
        Math.round((Date.now() - questionStartTime) / 1000)
      );
      const payload = {
        userId: user.id,
        subject: "hebrew",
        correct: correct,
        timeSpent: timeSpent,
      };
      console.log("[HebrewQuizPage] Submitting:", payload);
      const response = await axios.post(
        "http://localhost:3000/api/user-stats/track-question",
        payload
      );
      console.log("[HebrewQuizPage] Backend response:", response.data);
      if (!response.data) {
        throw new Error("No response data received");
      }
      await refetchStats();
    } catch (error) {
      console.error("Failed to track question:", error);
      if (axios.isAxiosError(error)) {
        alert(
          `Failed to save progress: ${
            error.response?.data?.message || error.message
          }`
        );
      } else {
        alert("Failed to save your progress. Please try again.");
      }
    }
  };

  const handleAnswerClick = (optionId: string) => {
    if (!isSubmitted) {
      setSelectedAnswer(optionId);
    }
  };

  const handleNextQuestion = async () => {
    setIsLoading(true);
    setDifficultyLevel((prev) =>
      isCorrect ? Math.min(prev + 1, 5) : Math.max(prev - 1, 1)
    );
    await fetchQuestion();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center items-center h-64">
                <svg
                  className="animate-spin h-12 w-12 text-purple-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        ) : !question ? (
          <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 flex justify-center items-center">
              <div className="text-xl font-semibold text-red-600">
                Failed to load question. Please try again.
              </div>
            </main>
          </div>
        ) : (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                dir="rtl"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Timer className="w-5 h-5" />
                    <span className="font-medium">Time Remaining:</span>
                    <span className="font-mono">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-gray-900">
                      Question {question.id} of {question.totalQuestions}
                      <span className="mr-2 text-sm font-normal text-purple-600">
                        (Level {difficultyLevel})
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="mb-8 text-right">
                  <p className="text-lg text-gray-800 whitespace-pre-line font-sans">
                    {question.question}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <RadioGroup
                    value={selectedAnswer}
                    onValueChange={setSelectedAnswer}
                    className="space-y-3"
                    disabled={isSubmitted}
                  >
                    {question.options.map((option: Option) => (
                      <label
                        key={option.id}
                        onClick={() => handleAnswerClick(option.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border",
                          isSubmitted && option.id === question.correctAnswer
                            ? "border-green-500 bg-green-50"
                            : isSubmitted &&
                              option.id === selectedAnswer &&
                              !isCorrect
                            ? "border-red-500 bg-red-50"
                            : option.id === selectedAnswer
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-500 hover:bg-purple-50",
                          "cursor-pointer transition-colors"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-700">{option.text}</span>
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">
                            {option.id}
                          </span>
                        </div>
                        <RadioGroupItem value={option.id} id={option.id} />
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {isSubmitted && (
                  <div className="mb-6 text-right">
                    <div className="flex items-center gap-2 mb-2 justify-end">
                      {isCorrect ? (
                        <>
                          <span className="font-medium text-green-600">
                            Correct! Well done!
                          </span>
                          <CheckCircle className="text-green-500" size={20} />
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-red-600">
                            {timeRemaining === 0
                              ? "Time's up!"
                              : "Incorrect. Try again!"}
                          </span>
                          <XCircle className="text-red-500" size={20} />
                        </>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {question.explanation}
                    </p>
                  </div>
                )}

                <div
                  className="flex flex-col sm:flex-row gap-4 text-left"
                  dir="ltr"
                >
                  {!isSubmitted && (
                    <Button
                      onClick={handleSubmit}
                      disabled={!selectedAnswer || isLoading}
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                    >
                      Submit Answer
                    </Button>
                  )}
                  {isSubmitted && (
                    <Button
                      onClick={handleNextQuestion}
                      className="w-full sm:w-auto border border-purple-600 text-purple-600 hover:bg-purple-50"
                      disabled={isLoading}
                    >
                      Next Question
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HebrewQuizPage;
