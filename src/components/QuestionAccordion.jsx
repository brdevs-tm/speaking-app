"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
        <AccordionItem key={part} value={part}>
          <AccordionTrigger>{part.toUpperCase()} Questions</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 space-y-2">
              {qs.map((q, index) => (
                <li key={index}>{q}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
