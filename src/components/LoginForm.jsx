"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginForm({ onLogin, setError }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = "https://speaking-app.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data.access_token);
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-indigo-700">
          Admin Login
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
