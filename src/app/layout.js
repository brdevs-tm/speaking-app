import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IELTS Speaking Practice",
  description:
    "Practice IELTS Speaking with random questions for Parts 1, 2, and 3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-blue-900 to-indigo-800 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
