import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, XCircle, Timer } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";

// Mock question data
const mockQuestion = {
  id: 1,
  totalQuestions: 5,
  question:
    "מה המשמעות של המילה 'שלום'?\nWhat is the meaning of the word 'שלום'?",
  options: [
    {
      id: "1",
      text: "Peace / Hello / Goodbye - שלום / להתראות",
    },
    {
      id: "2",
      text: "War / Conflict - מלחמה / סכסוך",
    },
    {
      id: "3",
      text: "Food / Meal - אוכל / ארוחה",
    },
    {
      id: "4",
      text: "House / Home - בית / דירה",
    },
  ],
  correctAnswer: "1",
  explanation:
    "המילה 'שלום' היא מילה רב-משמעית המשמשת לברכה, פרידה ומשמעותה גם שלווה ורוגע.\nThe word 'Shalom' is a versatile word used for greeting, farewell, and also means peace and tranquility.",
};

const HebrewQuizPage = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds = 1 minute

  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    if (!selectedAnswer && timeRemaining === 0) {
      setSelectedAnswer(""); // Force an incorrect answer if time runs out
    }
    const correct = selectedAnswer === mockQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleAnswerClick = (optionId: string) => {
    if (!isSubmitted) {
      setSelectedAnswer(optionId);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Quiz Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Timer and Question Number */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Timer className="w-5 h-5" />
                  <span className="font-medium">Time Remaining:</span>
                  <span className="font-mono">{formatTime(timeRemaining)}</span>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-bold text-gray-900">
                    Question {mockQuestion.id} out of{" "}
                    {mockQuestion.totalQuestions}
                  </h2>
                </div>
              </div>

              {/* Question Navigation */}
              <div className="flex justify-center gap-2 mb-8">
                {Array.from({ length: mockQuestion.totalQuestions }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={mockQuestion.id === i + 1 ? "default" : "outline"}
                    className={cn(
                      "w-12 h-12",
                      mockQuestion.id === i + 1 &&
                        "bg-purple-600 hover:bg-purple-700"
                    )}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              {/* Question Content */}
              <div className="mb-8 text-right" dir="rtl">
                <p className="text-lg text-gray-800 whitespace-pre-line font-sans">
                  {mockQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-4 mb-8" dir="rtl">
                <RadioGroup
                  value={selectedAnswer}
                  onValueChange={setSelectedAnswer}
                  className="space-y-3"
                  disabled={isSubmitted}
                >
                  {mockQuestion.options.map((option) => (
                    <label
                      key={option.id}
                      onClick={() => handleAnswerClick(option.id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border",
                        isSubmitted && option.id === mockQuestion.correctAnswer
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

              {/* Feedback Section */}
              {isSubmitted && (
                <div className="mb-6 text-right" dir="rtl">
                  <div className="flex items-center gap-2 mb-2 justify-end">
                    {isCorrect ? (
                      <>
                        <span className="font-medium text-green-600">
                          !כל הכבוד! תשובה נכונה
                        </span>
                        <CheckCircle className="text-green-500" size={20} />
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-red-600">
                          {timeRemaining === 0
                            ? "!נגמר הזמן"
                            : "!לא נכון. נסה שוב"}
                        </span>
                        <XCircle className="text-red-500" size={20} />
                      </>
                    )}
                  </div>
                  {isCorrect && (
                    <p className="mt-2 text-sm text-gray-600">
                      {mockQuestion.explanation}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="text-left" dir="ltr">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer || isSubmitted}
                  className="w-full md:w-auto bg-purple-600 hover:bg-purple-700"
                >
                  Submit Answer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HebrewQuizPage;
