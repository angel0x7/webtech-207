'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabaseClient'
import type { User } from '@supabase/supabase-js'

// Contexte utilisateur pour gérer l'authentification et le thème
interface UserContextType {
  user: User | null
  signOut: () => Promise<void>
  theme: string
  setTheme: (theme: string) => void
}

// Création du contexte
const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [theme, setTheme] = useState('system')

  useEffect(() => {

    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null)
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {

    if (theme === 'system') {
      document.documentElement.classList.remove('dark')
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return <UserContext.Provider value={{ user, signOut, theme, setTheme }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}
