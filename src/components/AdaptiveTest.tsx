import React, { useState, useEffect } from "react";
import { useAdaptive } from "../context/AdaptiveContext";
import axios from "axios";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

export const AdaptiveTest: React.FC = () => {
  const { currentDifficulty, submitAnswer } = useAdaptive();
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);

  const fetchQuestion = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post("/api/questions/generate", {
        userId,
        difficulty: currentDifficulty,
      });
      setQuestion(response.data);
      setQuestions((prev) => {
        const updated = [...prev];
        updated[currentQuestionNumber - 1] = response.data;
        return updated;
      });
      setStartTime(Date.now());
    } catch (error) {
      console.error("Error fetching question:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line
  }, [currentDifficulty, currentQuestionNumber]);

  const handleAnswerSubmit = async (answer: string) => {
    if (!question) return;
    setSelectedAnswer(answer);
    const responseTime = (Date.now() - startTime) / 1000; // Convert to seconds
    const isCorrect = answer === question.correctAnswer;
    await submitAnswer(isCorrect, responseTime);
    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQuestionNumber < TOTAL_QUESTIONS) {
        setCurrentQuestionNumber((n) => n + 1);
      } else {
        // Optionally show results or reset
      }
    }, 1500);
  };

  const handleQuestionNumberClick = (num: number) => {
    setCurrentQuestionNumber(num);
    if (questions[num - 1]) {
      setQuestion(questions[num - 1]);
    } else {
      setQuestion(null);
    }
    setSelectedAnswer(null);
  };

  if (isLoading) {
    return (
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
    );
  }

  if (!question) {
    return <div>No question available</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Numbers */}
      <div className="flex justify-center gap-2 mb-4">
        {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handleQuestionNumberClick(i + 1)}
            className={`w-8 h-8 rounded-full border text-sm font-bold transition-colors
              ${
                currentQuestionNumber === i + 1
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-purple-600 border-purple-300 hover:bg-purple-50"
              }
            `}
            disabled={currentQuestionNumber === i + 1}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="mb-4 text-center text-gray-600">
        Question {currentQuestionNumber} out of {TOTAL_QUESTIONS}
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSubmit(option)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 text-left rounded-lg border transition-colors
                ${
                  selectedAnswer === null
                    ? "hover:bg-gray-50 border-gray-200"
                    : selectedAnswer === option
                    ? option === question.correctAnswer
                      ? "bg-green-100 border-green-500"
                      : "bg-red-100 border-red-500"
                    : option === question.correctAnswer &&
                      selectedAnswer !== null
                    ? "bg-green-100 border-green-500"
                    : "bg-gray-50 border-gray-200"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
        {selectedAnswer && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              selectedAnswer === question.correctAnswer
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {selectedAnswer === question.correctAnswer
              ? "Correct!"
              : `Incorrect. The correct answer is: ${question.correctAnswer}`}
          </div>
        )}
      </div>
    </div>
  );
};
