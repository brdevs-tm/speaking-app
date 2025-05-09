"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { motion } from "framer-motion";

export default function QuestionAccordion({
  token,
  setError,
  initialQuestions,
  isSearchMode,
}) {
  const [questions, setQuestions] = useState({});
  const [editQuestion, setEditQuestion] = useState(null);
  const [editValue, setEditValue] = useState("");
  const API_URL = "https://speaking-app.onrender.com";

  useEffect(() => {
    if (isSearchMode && initialQuestions) {
      const grouped = initialQuestions.reduce((acc, q) => {
        acc[q.part] = acc[q.part] || [];
        acc[q.part].push({ id: q.id, question: q.question });
        return acc;
      }, {});
      setQuestions(grouped);
    } else {
      const fetchQuestions = async () => {
        try {
          const response = await fetch(
            `${API_URL}/api/speaking/all-questions`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await response.json();
          if (response.ok) {
            const grouped = data.reduce((acc, q) => {
              acc[q.part] = acc[q.part] || [];
              acc[q.part].push({ id: q.id, question: q.question });
              return acc;
            }, {});
            setQuestions(grouped);
            setError(null);
          } else {
            setError(data.detail);
          }
        } catch (err) {
          setError("Network error: " + err.message);
        }
      };
      fetchQuestions();
    }
  }, [token, setError, initialQuestions, isSearchMode]);

  const handleDelete = async (part, id) => {
    try {
      const response = await fetch(`${API_URL}/api/speaking/${part}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setQuestions((prev) => ({
          ...prev,
          [part]: prev[part].filter((q) => q.id !== id),
        }));
        setError(null);
      } else {
        setError(data.detail);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  const handleEdit = async (part, id) => {
    if (!editValue) {
      setError("Please enter a new question");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/speaking/${part}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: editValue }),
      });
      const data = await response.json();
      if (response.ok) {
        setQuestions((prev) => ({
          ...prev,
          [part]: prev[part].map((q) =>
            q.id === id ? { ...q, question: editValue } : q
          ),
        }));
        setEditQuestion(null);
        setEditValue("");
        setError(null);
      } else {
        setError(data.detail);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(questions).length > 0 ? (
        Object.entries(questions).map(([part, qs]) => (
          <AccordionItem
            key={part}
            value={part}
            className="border-b border-indigo-200"
          >
            <AccordionTrigger className="text-xl font-semibold text-indigo-700 hover:bg-indigo-50 p-4 rounded">
              {part.toUpperCase()} Questions
            </AccordionTrigger>
            <AccordionContent className="bg-indigo-50 p-4 rounded">
              <ul className="space-y-4">
                {qs.map((q) => (
                  <motion.li
                    key={q.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                  >
                    {editQuestion === q.id ? (
                      <div className="flex-1 flex space-x-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 border-indigo-300 focus:border-indigo-500 rounded-lg"
                        />
                        <Button
                          onClick={() => handleEdit(part, q.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditQuestion(null)}
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-100"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-700 flex-1">
                          <strong>ID:</strong> {q.id} - {q.question}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => {
                              setEditQuestion(q.id);
                              setEditValue(q.question);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(part, q.id)}
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))
      ) : (
        <p className="text-center text-gray-600 p-4">No questions found.</p>
      )}
    </Accordion>
  );
}
