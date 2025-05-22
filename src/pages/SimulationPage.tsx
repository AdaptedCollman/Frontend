import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import axios from "axios";

const CHAPTERS = [
  { label: "English", topic: "english", count: 22 },
  { label: "Hebrew", topic: "hebrew", count: 23 },
  { label: "Math", topic: "math", count: 20 },
];
const SIMULATION_TIME = 60 * 60; // 1 hour in seconds

interface Question {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

const SimulationPage: React.FC = () => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[][]>([[], [], []]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(SIMULATION_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Fetch question if not already loaded
  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true);
      try {
        const chapter = CHAPTERS[currentChapter];
        if (!questions[currentChapter][currentQuestion]) {
          const res = await axios.post("http://localhost:3000/api/questions", {
            topic: chapter.topic,
            difficulty: 3,
          });
          const q = res.data;
          const newQ: Question = {
            id: `${currentChapter}-${currentQuestion}`,
            question: q.content,
            options: q.answerOptions.map((text: string, idx: number) => ({
              id: (idx + 1).toString(),
              text,
            })),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          };
          setQuestions((prev) => {
            const updated = prev.map((arr) => [...arr]);
            updated[currentChapter][currentQuestion] = newQ;
            return updated;
          });
        }
      } catch (err) {
        console.error("Failed to fetch question:", err);
      }
      setIsLoading(false);
    };
    fetchQuestion();
    setSelectedAnswer("");
    setIsSubmitted(false);
    setIsCorrect(false);
  }, [currentChapter, currentQuestion]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    const q = questions[currentChapter][currentQuestion];
    if (!q) return;
    setIsCorrect(selectedAnswer === q.correctAnswer);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestion < CHAPTERS[currentChapter].count - 1) {
      setCurrentQuestion((q) => q + 1);
    } else if (currentChapter < CHAPTERS.length - 1) {
      setCurrentChapter((c) => c + 1);
      setCurrentQuestion(0);
    } else {
      // Optionally show summary or finish
    }
  };

  const q = questions[currentChapter][currentQuestion];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg font-bold">Simulation</div>
            <div className="text-lg font-mono">
              Time Left: {formatTime(timer)}
            </div>
          </div>
          <div className="flex gap-2 mb-6">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.label}
                className={`px-4 py-2 rounded-lg font-semibold border transition-colors ${
                  idx === currentChapter
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-purple-600 border-purple-300 hover:bg-purple-50"
                }`}
                onClick={() => {
                  setCurrentChapter(idx);
                  setCurrentQuestion(0);
                }}
                disabled={isLoading}
              >
                {ch.label}
              </button>
            ))}
          </div>
          <div className="mb-4 text-gray-600">
            Chapter {CHAPTERS[currentChapter].label} — Question{" "}
            {currentQuestion + 1} of {CHAPTERS[currentChapter].count}
          </div>
          {isLoading || !q ? (
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
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">{q.question}</h2>
              <div className="space-y-3 mb-4">
                {q.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedAnswer(option.id)}
                    disabled={isSubmitted}
                    className={`w-full p-4 text-left rounded-lg border transition-colors
                      ${
                        !isSubmitted
                          ? selectedAnswer === option.id
                            ? "bg-purple-100 border-purple-500"
                            : "hover:bg-gray-50 border-gray-200"
                          : selectedAnswer === option.id
                          ? option.id === q.correctAnswer
                            ? "bg-green-100 border-green-500"
                            : "bg-red-100 border-red-500"
                          : option.id === q.correctAnswer && isSubmitted
                          ? "bg-green-100 border-green-500"
                          : "bg-gray-50 border-gray-200"
                      }
                    `}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
              {isSubmitted && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isCorrect
                    ? "Correct!"
                    : `Incorrect. The correct answer is: ${
                        q.options.find((o) => o.id === q.correctAnswer)?.text
                      }`}
                  <div className="mt-2 text-sm text-gray-600">
                    {q.explanation}
                  </div>
                </div>
              )}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer || isSubmitted}
                  className="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
                >
                  Submit Answer
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold"
                  disabled={isLoading}
                >
                  {currentQuestion < CHAPTERS[currentChapter].count - 1
                    ? "Next Question"
                    : currentChapter < CHAPTERS.length - 1
                    ? "Next Chapter"
                    : "Finish"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SimulationPage;
