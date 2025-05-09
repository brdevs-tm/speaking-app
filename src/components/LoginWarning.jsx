"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginWarning({ onProceed }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-md"
    >
      <Card className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-red-200">
        <CardHeader className="bg-red-500 text-white rounded-t-2xl">
          <CardTitle className="text-3xl font-bold text-center">
            Warning
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-center text-gray-700 text-lg">
            This page is for admins only. Proceed only if you have admin
            credentials.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-100 font-semibold py-2 px-4 rounded-lg"
            >
              Go Back
            </Button>
            <Button
              onClick={onProceed}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Proceed
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
