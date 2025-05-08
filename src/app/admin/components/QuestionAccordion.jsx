"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";

export default function QuestionAccordion({ token, setError }) {
  const [questions, setQuestions] = useState({});
  const API_URL = "https://speaking-app.onrender.com";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/speaking/all-questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          const grouped = data.reduce((acc, q) => {
            acc[q.part] = acc[q.part] || [];
            acc[q.part].push(q.question);
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
  }, [token, setError]);

  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(questions).map(([part, qs]) => (
        <AccordionItem
          key={part}
          value={part}
          className="border-b border-indigo-200"
        >
          <AccordionTrigger className="text-lg font-semibold text-indigo-700 hover:bg-indigo-50 p-2 rounded">
            {part.toUpperCase()} Questions
          </AccordionTrigger>
          <AccordionContent className="bg-indigo-50 p-4 rounded">
            <ul className="list-disc pl-5 space-y-2">
              {qs.map((q, index) => (
                <li key={index} className="text-gray-700">
                  {q}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
