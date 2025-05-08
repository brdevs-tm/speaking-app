"use client";

import Dashboard from "@/components/Dashboard";
import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Admin() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("adminToken", newToken);
    setError(null);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("adminToken");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {!token ? (
        <LoginForm onLogin={handleLogin} setError={setError} />
      ) : (
        <div className="w-full max-w-4xl">
          <div className="flex justify-end mb-4">
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
          <Dashboard token={token} setError={setError} />
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      )}
    </div>
  );
}
