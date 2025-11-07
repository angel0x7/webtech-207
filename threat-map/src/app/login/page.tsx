'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../config/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // Attendre que la session soit persistée
        await new Promise(resolve => setTimeout(resolve, 300))

        // Navigation React (pas de reload complet)
        router.push('/')
        router.refresh() // Force le refresh du layout pour mettre à jour UserContext
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue')
      setLoading(false)
      console.error('Erreur de connexion:', err)
    }
  }

  const handleGitHubLogin = async () => {
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
      // Pas besoin de setLoading(false) car la page va être redirigée
    } catch (err) {
      setError('Erreur lors de la connexion GitHub')
      setLoading(false)
      console.error('Erreur GitHub OAuth:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="relative bg-gray-900/80 border border-cyan-500/30 rounded-2xl shadow-[0_0_25px_#00fff2] p-8 w-full max-w-md backdrop-blur-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-cyan-300 drop-shadow-[0_0_6px_#00fff2]">
          Connexion
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              autoComplete="email"
              className="w-full p-3 rounded bg-[#0f172a] border border-cyan-500/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="current-password"
              minLength={6}
              className="w-full p-3 rounded bg-[#0f172a] border border-cyan-500/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-2.5 rounded-lg font-semibold uppercase tracking-wide bg-gradient-to-r from-cyan-400 to-blue-600 text-gray-900 hover:from-cyan-300 hover:to-blue-500 transition-all shadow-[0_0_15px_#00fff2] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-cyan-400 disabled:hover:to-blue-600"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion...
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="text-gray-400 text-sm px-4">ou</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        <button
          onClick={handleGitHubLogin}
          disabled={loading}
          className="w-full bg-[#111827] hover:bg-[#1f2937] border border-gray-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-3 shadow-[0_0_10px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="mt-4 p-3 rounded bg-red-900/20 border border-red-700/30 animate-pulse">
            <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Pas encore de compte ?{' '}
            <button
              onClick={() => router.push('/signup')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors underline"
            >
              S&apos;inscrire
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}