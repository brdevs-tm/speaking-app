"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import QuestionAccordion from "./QuestionAccordion";

export default function Dashboard({ token, setError }) {
  const [question, setQuestion] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const API_URL = "https://speaking-app.onrender.com";

  const addQuestion = async (part) => {
    if (!question) {
      setError("Please enter a question");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/speaking/${part}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (response.ok) {
        setError(null);
        setQuestion("");
        alert(`Success: ${data.message}`);
      } else {
        setError(data.detail);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  const updateAdmin = async () => {
    if (!newUsername || !newPassword) {
      setError("Please enter both username and password");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/auth/admin/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setError(null);
        setNewUsername("");
        setNewPassword("");
        alert(`Success: ${data.message}`);
        window.location.reload(); // Reload to force re-login
      } else {
        setError(data.detail);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white/90 backdrop-blur-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-purple-700">
            Add Question
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Enter new question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full"
          />
          <div className="flex space-x-2">
            <Button
              onClick={() => addQuestion("part1")}
              className="bg-green-600 hover:bg-green-700"
            >
              Add to Part 1
            </Button>
            <Button
              onClick={() => addQuestion("part2")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add to Part 2
            </Button>
            <Button
              onClick={() => addQuestion("part3")}
              className="bg-red-600 hover:bg-red-700"
            >
              Add to Part 3
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-purple-700">
            Update Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full"
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full"
          />
          <Button
            onClick={updateAdmin}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Update Credentials
          </Button>
        </CardContent>
      </Card>

      <Card className="col-span-2 bg-white/90 backdrop-blur-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-purple-700">
            All Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionAccordion token={token} setError={setError} />
        </CardContent>
      </Card>
    </div>
  );
}
