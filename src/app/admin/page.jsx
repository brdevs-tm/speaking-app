"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginWarning from "@/components/LoginWarning";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Dashboard from "./components/Dashboard";

export default function Admin() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
      setShowLogin(true);
    }
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("adminToken", newToken);
    setError(null);
    setShowLogin(true);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("adminToken");
    setError(null);
    setShowLogin(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {!showLogin ? (
        <LoginWarning onProceed={() => setShowLogin(true)} />
      ) : !token ? (
        <div className="w-full max-w-md">
          <Card className="bg-white/90 backdrop-blur-md shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-indigo-700">
                Admin Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const username = e.target.username.value;
                  const password = e.target.password.value;
                  try {
                    const response = await fetch(
                      `https://speaking-app.onrender.com/api/auth/admin-login`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, password }),
                      }
                    );
                    const data = await response.json();
                    if (response.ok) {
                      handleLogin(data.access_token);
                    } else {
                      setError(data.detail || "Login failed");
                    }
                  } catch (err) {
                    setError("Network error: " + err.message);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="w-full"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
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
              {error && (
                <p className="text-red-500 text-center mt-2">{error}</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="w-full max-w-5xl">
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
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
