"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { loadSlim } from "@tsparticles/slim";
import Particles from "@tsparticles/react";

export default function LandingPage() {
  const router = useRouter();

  const particlesInit = async (engine) => {
    await loadSlim(engine);
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
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mx-auto p-4 flex items-center justify-center min-h-screen"
      >
        <Card className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-indigo-200">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardTitle className="text-4xl font-extrabold text-center">
              IELTS Speaking Pro
            </CardTitle>
            <p className="text-center text-indigo-100 mt-2">
              Master your IELTS Speaking with ease
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <motion.div
              className="flex justify-center space-x-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                onClick={() => router.push("/part/part1")}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-transform"
              >
                Part 1
              </Button>
              <Button
                onClick={() => router.push("/part/part2")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-transform"
              >
                Part 2
              </Button>
              <Button
                onClick={() => router.push("/part/part3")}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-transform"
              >
                Part 3
              </Button>
            </motion.div>
            <div className="text-center">
              <Button
                onClick={() => router.push("/admin")}
                variant="outline"
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-100 font-semibold py-2 px-4 rounded-lg shadow-sm"
              >
                Admin Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
