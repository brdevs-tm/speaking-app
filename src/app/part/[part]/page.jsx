"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { loadSlim } from "@tsparticles/slim";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Particles from "@tsparticles/react";

export default function PartPage() {
  const router = useRouter();
  const { part } = useParams();
  const [questions, setQuestions] = useState([]);
  const [shownQuestionIds, setShownQuestionIds] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showRepeatPrompt, setShowRepeatPrompt] = useState(false);
  const API_URL = "https://speaking-app.onrender.com";

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

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

  useEffect(() => {
    if (currentQuestion) {
      const utterance = new SpeechSynthesisUtterance(currentQuestion);
      utterance.lang = "en-US";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentQuestion]);

  const pickRandomQuestion = useCallback(
    (availableQuestions, alreadyShownIds) => {
      const remaining = availableQuestions.filter(
        (_, index) => !alreadyShownIds.includes(index)
      );
      if (remaining.length === 0) {
        setShowRepeatPrompt(true);
        return;
      }
      const randomIndex = Math.floor(Math.random() * remaining.length);
      const newQuestionIndex = availableQuestions.indexOf(
        remaining[randomIndex]
      );
      setCurrentQuestion(availableQuestions[newQuestionIndex]);
      setShownQuestionIds([...alreadyShownIds, newQuestionIndex]);
    },
    []
  );

  const handleNextQuestion = () => {
    if (showRepeatPrompt) {
      setShowRepeatPrompt(false);
      setShownQuestionIds([]);
      pickRandomQuestion(questions, []);
    } else {
      pickRandomQuestion(questions, shownQuestionIds);
    }
  };

  const handleRepeatQuestions = () => {
    setShowRepeatPrompt(false);
    setShownQuestionIds([]);
    pickRandomQuestion(questions, []);
  };

  const handleCancelRepeat = () => {
    setShowRepeatPrompt(false);
    setCurrentQuestion(null);
  };

  const handleReadAloud = () => {
    if (currentQuestion) {
      const utterance = new SpeechSynthesisUtterance(currentQuestion);
      utterance.lang = "en-US";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#1e1b4b",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 200, duration: 0.4 },
            },
          },
          particles: {
            color: { value: "#ffffff" },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 80,
            },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-3xl mx-auto p-4 flex items-center justify-center min-h-screen"
      >
        <Card className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-indigo-200 w-full">
          <CardHeader className="bg-indigo-500 text-white rounded-t-2xl">
            <CardTitle className="text-3xl font-bold text-center">
              {part.toUpperCase()} Practice
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-100 font-semibold py-2 px-4 rounded-lg"
              >
                Back to Home
              </Button>
            </div>
            {showRepeatPrompt ? (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <AlertTitle className="text-yellow-800">
                  Questions Finished
                </AlertTitle>
                <AlertDescription className="text-yellow-700">
                  All questions have been shown. Would you like to repeat them?
                  <div className="mt-4 flex space-x-2">
                    <Button
                      onClick={handleRepeatQuestions}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Yes, Repeat
                    </Button>
                    <Button
                      onClick={handleCancelRepeat}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-100 font-semibold py-2 px-4 rounded-lg"
                    >
                      No, Stop
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ) : currentQuestion ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-indigo-50 p-6 rounded-lg shadow-inner"
              >
                <p className="text-xl font-medium text-indigo-800">
                  {currentQuestion}
                </p>
                <Button
                  onClick={handleReadAloud}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Read Aloud</span>
                </Button>
              </motion.div>
            ) : (
              <p className="text-center text-gray-600">
                No questions available.
              </p>
            )}
            <div className="text-center">
              <Button
                onClick={handleNextQuestion}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-transform"
                disabled={showRepeatPrompt}
              >
                Next Random Question
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
