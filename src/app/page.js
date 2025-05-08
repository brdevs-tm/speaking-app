"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Redirect to admin login on load
  router.push("/admin");

  return null;
}
