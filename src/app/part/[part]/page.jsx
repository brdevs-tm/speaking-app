"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PartPage() {
  const router = useRouter();
  const { part } = useParams();
  const [questions, setQuestions] = useState([]);
  const [shownQuestions, setShownQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const API_URL = "https://speaking-app.onrender.com";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/speaking/${part}`);
        const data = await response.json();
        if (response.ok) {
          setQuestions(data.questions);
          pickRandomQuestion(data.questions, []);
        } else {
          alert("Error fetching questions");
        }
      } catch (err) {
        alert("Network error: " + err.message);
      }
    };
    fetchQuestions();
  }, [part]);

  const pickRandomQuestion = (availableQuestions, alreadyShown) => {
    const remaining = availableQuestions.filter(
      (q) => !alreadyShown.includes(q)
    );
    if (remaining.length === 0) {
      setShownQuestions([]);
      setCurrentQuestion(null);
      alert("All questions have been shown. Starting over.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * remaining.length);
    const newQuestion = remaining[randomIndex];
    setCurrentQuestion(newQuestion);
    setShownQuestions([...alreadyShown, newQuestion]);
  };

  const handleNextQuestion = () => {
    pickRandomQuestion(questions, shownQuestions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-indigo-700">
            {part.toUpperCase()} Practice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-100"
            >
              Back to Home
            </Button>
          </div>
          {currentQuestion ? (
            <div className="bg-indigo-50 p-4 rounded-lg shadow-inner">
              <p className="text-lg font-medium text-indigo-800">
                {currentQuestion}
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No more questions available.
            </p>
          )}
          <div className="text-center">
            <Button
              onClick={handleNextQuestion}
              className="bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105 transition-transform"
            >
              Next Random Question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
