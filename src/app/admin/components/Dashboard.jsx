"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Upload, BarChart, Lock } from "lucide-react";
import QuestionAccordion from "./QuestionAccordion";
import { motion } from "framer-motion";

export default function Dashboard({ token, setError }) {
  const [questions, setQuestions] = useState({
    part1: "",
    part2: "",
    part3: "",
  });
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [batchImport, setBatchImport] = useState("");
  const [counts, setCounts] = useState({ part1: 0, part2: 0, part3: 0 });
  const [searchResults, setSearchResults] = useState(null);
  const API_URL = "https://speaking-app.onrender.com";

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/speaking/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setCounts(data);
          setError(null);
        } else {
          setError(data.detail);
        }
      } catch (err) {
        setError("Network error: " + err.message);
      }
    };
    fetchCounts();
  }, [token, setError]);

  const addQuestion = async (part) => {
    const question = questions[part];
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
        setQuestions((prev) => ({ ...prev, [part]: "" }));
        alert(`Success: ${data.message}`);
        // Update counts
        setCounts((prev) => ({ ...prev, [part]: prev[part] + 1 }));
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
        window.location.reload();
      } else {
        setError(data.detail);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      setSearchResults(null);
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/api/speaking/search?query=${encodeURIComponent(
          searchQuery
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSearchResults(data.results);
        setError(null);
      } else {
        setError(data.detail);
        setSearchResults(null);
      }
    } catch (err) {
      setError("Network error: " + err.message);
      setSearchResults(null);
    }
  };

  const handleImport = async () => {
    try {
      const questionsData = JSON.parse(batchImport);
      const response = await fetch(`${API_URL}/api/speaking/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questions: questionsData }),
      });
      const data = await response.json();
      if (response.ok) {
        setError(null);
        setBatchImport("");
        alert(`Success: ${data.message}`);
        // Update counts after import
        const countsResponse = await fetch(`${API_URL}/api/speaking/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const countsData = await countsResponse.json();
        if (countsResponse.ok) {
          setCounts(countsData);
        }
      } else {
        setError(data.detail);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="space-y-8 w-full"
    >
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl rounded-2xl">
        <CardHeader className="p-8">
          <CardTitle className="text-4xl font-extrabold text-center animate-pulse">
            Admin Dashboard
          </CardTitle>
          <p className="text-center text-indigo-100 mt-2">
            Manage your IELTS Speaking platform with ease
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl border border-indigo-200 transform hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-indigo-700 flex items-center">
                <Plus className="mr-2" /> Add Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Add to Part 1"
                  value={questions.part1}
                  onChange={(e) =>
                    setQuestions({ ...questions, part1: e.target.value })
                  }
                  className="border-indigo-300 focus:border-indigo-500 rounded-lg shadow-sm"
                />
                <Button
                  onClick={() => addQuestion("part1")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Add to Part 1
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Add to Part 2"
                  value={questions.part2}
                  onChange={(e) =>
                    setQuestions({ ...questions, part2: e.target.value })
                  }
                  className="border-indigo-300 focus:border-indigo-500 rounded-lg shadow-sm"
                />
                <Button
                  onClick={() => addQuestion("part2")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Add to Part 2
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Add to Part 3"
                  value={questions.part3}
                  onChange={(e) =>
                    setQuestions({ ...questions, part3: e.target.value })
                  }
                  className="border-indigo-300 focus:border-indigo-500 rounded-lg shadow-sm"
                />
                <Button
                  onClick={() => addQuestion("part3")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Add to Part 3
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl border border-indigo-200 transform hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-indigo-700 flex items-center">
                <Lock className="mr-2" /> Update Admin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="New Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="border-indigo-300 focus:border-indigo-500 rounded-lg shadow-sm"
              />
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-indigo-300 focus:border-indigo-500 rounded-lg shadow-sm"
              />
              <Button
                onClick={updateAdmin}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg"
              >
                Update Credentials
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl border border-indigo-200 transform hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-indigo-700 flex items-center">
                <Upload className="mr-2" /> Batch Import
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder='[{"part": "part1", "question": "Test question"}]'
                value={batchImport}
                onChange={(e) => setBatchImport(e.target.value)}
                className="border-indigo-300 focus:border-indigo-500 rounded-lg shadow-sm"
              />
              <Button
                onClick={handleImport}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg"
              >
                Import Questions
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl border border-indigo-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-indigo-700 flex items-center">
              <Search className="mr-2" /> Search Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-indigo-300 focus:border-indigo-500 rounded-lg shadow-sm"
              />
              <Button
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Search
              </Button>
            </div>
            {searchResults && (
              <QuestionAccordion
                token={token}
                setError={setError}
                initialQuestions={searchResults}
                isSearchMode={true}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl border border-indigo-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-indigo-700 flex items-center">
              <BarChart className="mr-2" /> Question Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-lg font-semibold text-indigo-700">Part 1</p>
                <p className="text-2xl font-bold">{counts.part1}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold text-blue-700">Part 2</p>
                <p className="text-2xl font-bold">{counts.part2}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-lg font-semibold text-red-700">Part 3</p>
                <p className="text-2xl font-bold">{counts.part3}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Card className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl border border-indigo-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-indigo-700">
              All Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionAccordion
              token={token}
              setError={setError}
              isSearchMode={false}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
