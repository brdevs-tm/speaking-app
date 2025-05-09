"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { loadSlim } from "@tsparticles/slim";
import LoginWarning from "../../components/LoginWarning";
import Dashboard from "./components/Dashboard";
import Particles from "@tsparticles/react";

export default function Admin() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
      setShowLogin(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
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
        setToken(data.access_token);
        localStorage.setItem("adminToken", data.access_token);
        setError(null);
        setShowLogin(true);
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("adminToken");
    setError(null);
    setShowLogin(false);
    router.push("/");
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
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {!showLogin ? (
          <LoginWarning onProceed={() => setShowLogin(true)} />
        ) : !token ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <Card className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-indigo-200 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
                <CardTitle className="text-4xl font-extrabold text-center">
                  Admin Login
                </CardTitle>
                <p className="text-center text-indigo-100 mt-2">
                  Secure access to manage your IELTS platform
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600" />
                      <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 border-indigo-300 focus:border-indigo-500 rounded-lg shadow-sm"
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600" />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 border-indigo-300 focus:border-indigo-500 rounded-lg shadow-sm"
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform"
                    >
                      Login
                    </Button>
                  </motion.div>
                </form>
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-center mt-4"
                  >
                    {error}
                  </motion.p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="w-full max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-end mb-6"
            >
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
              >
                Logout
              </Button>
            </motion.div>
            <Dashboard token={token} setError={setError} />
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center mt-4"
              >
                {error}
              </motion.p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
