"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginButton() {
  const router = useRouter();

  return (
    <div className="absolute top-2 right-6 z-[200] flex gap-3">
  <button
    onClick={() => router.push("/login")}
    className="px-5 py-2 font-semibold text-white rounded-lg 
                   bg-gradient-to-r from-cyan-700 to-blue-700 
                   hover:from-cyan-600 hover:to-blue-600 
                   border border-blue-500/30 
                   transition-all duration-200"
  >
    Login
  </button>

  <button
    onClick={() => router.push("/signup")}
    className="px-5 py-2 font-semibold text-white rounded-lg 
                   bg-gradient-to-r from-emerald-700 to-green-700 
                   hover:from-emerald-600 hover:to-green-600 
                   border border-green-500/30 
                   transition-all duration-200"
  >
    Première connexion
  </button>
</div>
  );
}
