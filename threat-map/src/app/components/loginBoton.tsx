"use client";

import { useRouter } from "next/navigation";


export default function LoginButton() {
    const router = useRouter();

    return (
        <div className="absolute top-4 right-6 flex gap-3">
            <button
                onClick={() => router.push("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 rounded-lg shadow-md transition-all">
            
                Login
            </button>

            <button
                onClick={() => router.push("/signup")}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 rounded-lg shadow-md transition-all">
            
                Première connexion
            </button>

        </div>
    );
}


