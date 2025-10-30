'use client'

import { useState } from 'react'
import { supabase } from '../config/supabaseClient' // adapte le chemin

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }, // stocke le nom dans user_metadata
      },
    })

    if (error) setError(error.message)
    else setSuccess(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Première connexion
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition-all"
          >
            Créer un compte
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
        {success && (
          <p className="text-green-400 text-sm mt-3 text-center">
            Vérifie ton email pour confirmer ton inscription.
          </p>
        )}

        <p className="text-center mt-4 text-sm text-gray-400">
          Déjà un compte ?{' '}
          <a href="/login" className="text-green-400 hover:underline">
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  )
}
