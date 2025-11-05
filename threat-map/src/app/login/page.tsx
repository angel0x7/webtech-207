'use client'

import { useState } from 'react'
import { supabase } from '../config/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else window.location.href = '/'
  }

  const handleGitHubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/` },
    })
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      {/* Fond animé cyber */}
    
    

      <div className="relative bg-gray-900/80 border border-cyan-500/30 rounded-2xl shadow-[0_0_25px_#00fff2] p-8 w-full max-w-md backdrop-blur-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-cyan-300 drop-shadow-[0_0_6px_#00fff2]">
          Connexion
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-[#0f172a] border border-cyan-500/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-[#0f172a] border border-cyan-500/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition"
          />
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold uppercase tracking-wide bg-gradient-to-r from-cyan-400 to-blue-600 text-gray-900 hover:from-cyan-300 hover:to-blue-500 transition-all shadow-[0_0_15px_#00fff2]"
          >
            Se connecter
          </button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <span className="text-gray-400 text-sm">ou</span>
        </div>

        <button
          onClick={handleGitHubLogin}
          className="w-full bg-[#111827] hover:bg-[#1f2937] border border-gray-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-3 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-gray-300"
          >
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.94.58.11.79-.25.79-.56v-2.1c-3.2.7-3.88-1.54-3.88-1.54-.52-1.31-1.28-1.66-1.28-1.66-1.04-.72.08-.71.08-.71 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.72 0-1.26.45-2.3 1.18-3.12-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.14 1.18a10.84 10.84 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.73.82 1.18 1.86 1.18 3.12 0 4.45-2.69 5.42-5.26 5.71.41.35.77 1.04.77 2.1v3.11c0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
          </svg>
          Se connecter avec GitHub
        </button>

        {error && (
          <p className="text-red-400 text-sm mt-4 text-center bg-red-900/20 border border-red-700/30 p-2 rounded">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
