import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar.tsx";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useSimulation } from "@/context/SimulationContext.tsx";
import { useNavigate } from "react-router-dom";
import {
  calculatePsychometricScore,
  getSectionStats,
  SectionResults,
} from "@/utils/psychometricScoring.ts";

const CHAPTERS = [
  { label: "English", topic: "english", count: 22 },
  { label: "Hebrew", topic: "hebrew", count: 23 },
  { label: "Math", topic: "math", count: 20 },
];
const SIMULATION_TIME = 60 * 60;

// בסיס ל־API מה־env
const API_BASE = import.meta.env.VITE_API_URL;

interface Question {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  selectedAnswer?: string;
}

const SimulationPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    setIsInSimulation,
    showNavigationModal,
    setShowNavigationModal,
    pendingNavigation,
    setPendingNavigation,
  } = useSimulation();
  const userId = user?.id;
  const hasCreatedTest = useRef(false);

  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[][]>([[], [], []]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(SIMULATION_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [testId, setTestId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // modals
  const [showStartModal, setShowStartModal] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [finalDuration, setFinalDuration] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [sectionStats, setSectionStats] = useState<any>(null);

  const [showChapterNavigationDeniedModal, setShowChapterNavigationDeniedModal] =
    useState(false);
  const [deniedChapterLabel, setDeniedChapterLabel] = useState<string>("");

  useEffect(() => {
    setIsInSimulation(true);
    return () => setIsInSimulation(false);
  }, []);

  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isTimerRunning]);

  // יצירת מבחן חדש
  useEffect(() => {
    const createTest = async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/tests`, {
          userId,
          numQuestions: 66,
          topics: ["english", "hebrew", "math"],
          difficulty: 3,
        });
        setTestId(res.data.testId);
        setStartTime(new Date());
      } catch (err) {
        console.error("Failed to create test:", err);
      }
    };

    if (!hasCreatedTest.current && !showStartModal) {
      hasCreatedTest.current = true;
      createTest();
    }
  }, [showStartModal, userId]);

  // שליפת שאלה
  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true);
      try {
        const chapter = CHAPTERS[currentChapter];
        if (!questions[currentChapter][currentQuestion]) {
          const res = await axios.post(`${API_BASE}/api/questions`, {
            topic: chapter.topic,
            difficulty: 3,
          });
          const q = res.data;

          const options = q.answerOptions.map((text: string, idx: number) => ({
            id: (idx + 1).toString(),
            text,
          }));

          const correctIndex = q.answerOptions.findIndex(
            (text: string) => text === q.correctAnswer
          );
          const correctAnswerId = (correctIndex + 1).toString();

          const newQ: Question = {
            id: `${currentChapter}-${currentQuestion}`,
            question: q.content,
            options,
            correctAnswer: correctAnswerId,
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
      setSelectedAnswer("");
      setIsSubmitted(false);
      setIsCorrect(false);
    };

    fetchQuestion();
  }, [currentChapter, currentQuestion, questions]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    const q = questions[currentChapter][currentQuestion];
    if (!q || !user?.id) return;

    const isAnswerCorrect = selectedAnswer === q.correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setIsSubmitted(true);

    try {
      const payload = {
        userId: user.id,
        subject: CHAPTERS[currentChapter].topic,
        correct: isAnswerCorrect,
        timeSpent: 1,
      };

      await axios.post(`${API_BASE}/api/user-stats/track-question`, payload);
    } catch (error) {
      console.error("Failed to track question:", error);
    }

    setQuestions((prev) => {
      const updated = prev.map((chapter, chIdx) =>
        chapter.map((qItem, qIdx) => {
          if (chIdx === currentChapter && qIdx === currentQuestion) {
            return { ...qItem, selectedAnswer };
          }
          return qItem;
        })
      );
      return updated;
    });
  };

  // סיום סימולציה
  const finishSimulation = async () => {
    const sectionResults: SectionResults = {
      english: { correct: 0, total: CHAPTERS[0].count },
      verbal: { correct: 0, total: CHAPTERS[1].count },
      quantitative: { correct: 0, total: CHAPTERS[2].count },
    };

    questions.forEach((chapter, chapterIndex) => {
      chapter.forEach((q) => {
        if (q && q.selectedAnswer === q.correctAnswer) {
          if (chapterIndex === 0) sectionResults.english.correct++;
          else if (chapterIndex === 1) sectionResults.verbal.correct++;
          else if (chapterIndex === 2) sectionResults.quantitative.correct++;
        }
      });
    });

    const psychometricScore = calculatePsychometricScore(sectionResults);
    const detailedStats = getSectionStats(sectionResults);

    const duration = startTime
      ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      : SIMULATION_TIME - timer;

    try {
      await axios.put(`${API_BASE}/api/tests/${testId}/finish`, {
        score: psychometricScore,
        duration,
      });
      setFinalScore(psychometricScore);
      setSectionStats(detailedStats);
      setFinalDuration(duration);
      setShowScoreModal(true);
      setIsTimerRunning(false);
    } catch (err) {
      console.error("Failed to finish test:", err);
    }
  };

  const handleSubmitClick = () => setShowConfirmModal(true);
  const handleNext = () => {
    if (currentQuestion < CHAPTERS[currentChapter].count - 1) {
      setCurrentQuestion((q) => q + 1);
    } else if (currentChapter < CHAPTERS.length - 1) {
      setCurrentChapter((c) => c + 1);
      setCurrentQuestion(0);
    } else {
      finishSimulation();
    }
  };

  const handleStartSimulation = () => {
    setShowStartModal(false);
    setIsTimerRunning(true);
  };

  const handleNavigationConfirm = () => {
    setShowNavigationModal(false);
    if (pendingNavigation) navigate(pendingNavigation);
    setPendingNavigation(null);
  };

  const handleNavigationCancel = () => {
    setShowNavigationModal(false);
    setPendingNavigation(null);
  };

  const handleChapterClick = (idx: number, label: string) => {
    if (idx !== currentChapter) {
      setDeniedChapterLabel(label);
      setShowChapterNavigationDeniedModal(true);
    } else {
      setCurrentChapter(idx);
      setCurrentQuestion(0);
    }
  };

  const q = questions[currentChapter][currentQuestion];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-3xl mx-auto">
          {/* Start Simulation Modal */}
          {showStartModal && (
            <div className="relative py-50 inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  Start New Simulation
                </h3>
                <div className="space-y-4 mb-6">
                  <p className="text-gray-600 text-center">
                    Ready to take the Israeli psychometric exam simulation? This
                    test follows the official format with proper scoring
                    weights.
                  </p>
                  <div className="text-center text-sm text-gray-500 space-y-1">
                    <p>• Total Questions: 66</p>
                    <p>• Time Limit: 60 minutes</p>
                    <p>• Scoring Range: 200-800</p>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-700 mb-1">
                        Section Weights:
                      </p>
                      <p className="text-xs">• Verbal Reasoning (Hebrew): 40%</p>
                      <p className="text-xs">
                        • Quantitative Reasoning (Math): 40%
                      </p>
                      <p className="text-xs">• English: 20%</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => (window.location.href = "/dashboard")}
                    className="px-6 py-2 cursor-pointer rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartSimulation}
                    className="px-6 py-2 cursor-pointer rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Start Simulation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Only show the rest of the content if the start modal is not shown */}
          {!showStartModal && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-bold">Simulation</div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSubmitClick}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                  >
                    Submit Test
                  </button>
                  <div className="text-lg font-mono">
                    Time Left: {formatTime(timer)}
                  </div>
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
                    onClick={() => handleChapterClick(idx, ch.label)}
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
                          }`}
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
                            q.options.find((o) => o.id === q.correctAnswer)
                              ?.text
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

              {/* Confirmation Modal */}
              {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
                    <h3 className="text-xl font-bold mb-4">
                      Confirm Submission
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Are you sure you want to submit your test? This action
                      cannot be undone.
                    </p>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setShowConfirmModal(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowConfirmModal(false);
                          finishSimulation();
                        }}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      >
                        Submit Test
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Score Modal */}
              {showScoreModal &&
                finalScore !== null &&
                finalDuration !== null && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
                      <h3 className="text-2xl font-bold mb-4 text-center">
                        Israeli Psychometric Exam Results
                      </h3>
                      <div className="space-y-6 mb-6">
                        {/* Final Score */}
                        <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                          <p className="text-5xl font-bold text-purple-600 mb-2">
                            {finalScore}
                          </p>
                          <p className="text-gray-600 text-lg">
                            Final Psychometric Score
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Range: 200-800
                          </p>
                        </div>

                        {/* Section Breakdown */}
                        {sectionStats && (
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-center mb-4">
                              Section Breakdown
                            </h4>

                            {/* Verbal Reasoning (Hebrew) */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="font-semibold text-blue-600">
                                  Verbal Reasoning (Hebrew)
                                </h5>
                                <span className="text-sm text-gray-500">
                                  Weight: 40%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  {sectionStats.verbal.correct}/
                                  {sectionStats.verbal.total} correct (
                                  {sectionStats.verbal.percentage}%)
                                </span>
                                <span className="font-bold text-blue-600">
                                  {sectionStats.verbal.score}
                                </span>
                              </div>
                            </div>

                            {/* Quantitative Reasoning (Math) */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="font-semibold text-green-600">
                                  Quantitative Reasoning (Math)
                                </h5>
                                <span className="text-sm text-gray-500">
                                  Weight: 40%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  {sectionStats.quantitative.correct}/
                                  {sectionStats.quantitative.total} correct (
                                  {sectionStats.quantitative.percentage}%)
                                </span>
                                <span className="font-bold text-green-600">
                                  {sectionStats.quantitative.score}
                                </span>
                              </div>
                            </div>

                            {/* English */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="font-semibold text-orange-600">
                                  English
                                </h5>
                                <span className="text-sm text-gray-500">
                                  Weight: 20%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  {sectionStats.english.correct}/
                                  {sectionStats.english.total} correct (
                                  {sectionStats.english.percentage}%)
                                </span>
                                <span className="font-bold text-orange-600">
                                  {sectionStats.english.score}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Time Taken */}
                        <div className="text-center bg-gray-50 rounded-lg p-4">
                          <p className="text-xl font-semibold mb-1">
                            {formatTime(finalDuration)}
                          </p>
                          <p className="text-gray-600">Time Taken</p>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <button
                          onClick={() => (window.location.href = "/dashboard")}
                          className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                        >
                          Return to Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              {/* Navigation Confirmation Modal */}
              {showNavigationModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
                    <h3 className="text-xl font-bold mb-4">
                      Leave Simulation?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You are currently in the middle of a simulation. If you
                      leave now, your progress will be lost.
                    </p>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={handleNavigationCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                      >
                        Stay in Simulation
                      </button>
                      <button
                        onClick={handleNavigationConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      >
                        Leave Simulation
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chapter Navigation Denied Modal */}
              {showChapterNavigationDeniedModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
                    <h3 className="text-xl font-bold mb-4">
                      Cannot Switch Chapters
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Please complete all questions in the current chapter
                      before moving to another chapter like{" "}
                      <span className="font-bold">{deniedChapterLabel}</span>.
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          setShowChapterNavigationDeniedModal(false)
                        }
                        className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                      >
                        Got It
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SimulationPage;
