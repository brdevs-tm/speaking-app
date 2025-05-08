"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-indigo-700 animate-pulse">
            IELTS Speaking Practice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => router.push("/part/part1")}
              className="bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-transform"
            >
              Part 1
            </Button>
            <Button
              onClick={() => router.push("/part/part2")}
              className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-transform"
            >
              Part 2
            </Button>
            <Button
              onClick={() => router.push("/part/part3")}
              className="bg-red-600 hover:bg-red-700 transform hover:scale-105 transition-transform"
            >
              Part 3
            </Button>
          </div>
          <div className="text-center">
            <Button
              onClick={() => router.push("/admin")}
              variant="outline"
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-100"
            >
              Admin Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
