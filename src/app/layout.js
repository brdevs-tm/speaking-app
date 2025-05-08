import "./globals.css";

export const metadata = {
  title: "IELTS Admin Panel",
  description: "Admin interface for IELTS speaking questions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
