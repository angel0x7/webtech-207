'use client'

import { ReactNode, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/footer'
import LoginButton from './components/loginBoton'
import LogoutButton from './components/LogoutButton'
import { useUser, UserProvider } from './context/UserContext'
import { getUserProfile } from './lib/profil'
import { useRouter } from 'next/navigation'
import './globals.css'

function LayoutContent({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [profile, setProfile] = useState<{ username?: string; avatar_url?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(user.id)
        setProfile(data)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : JSON.stringify(err)
        console.error('Erreur récupération profil :', message)
      }
    }
    fetchProfile()
  }, [user])

  return (
    <div
      className="flex flex-col min-h-screen relative"
      style={{
        backgroundColor: '#0a0f14',
        color: '#d7f9f1',
        fontFamily: '"JetBrains Mono", monospace',
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(0,255,246,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,217,163,0.08) 0%, transparent 40%)',
      }}
    >
      {/* Barre supérieure */}
      <Navbar />

      {/* Zone utilisateur */}
      <div className="absolute top-4 right-6 flex items-center gap-3">
        {!user ? (
          <LoginButton />
        ) : (
          <>
            {profile?.avatar_url && (
              <div
                className="rounded-full p-[2px]"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(0,255,246,0.8), rgba(0,217,163,0.8))',
                  boxShadow: '0 0 10px rgba(0,255,246,0.4)',
                }}
              >
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            )}

            {profile?.username && (
              <span className="text-cyan-400 font-semibold tracking-wide">
                {profile.username}
              </span>
            )}

            <button
              onClick={() => router.push('/profile')}
              className="text-[#0a0f14] font-bold px-4 py-1 rounded transition-transform duration-150"
              style={{
                background:
                  'linear-gradient(90deg, #00fff6 0%, #00d9a3 100%)',
                boxShadow: '0 0 10px rgba(0,255,246,0.6)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Profil
            </button>

            <LogoutButton />
          </>
        )}
      </div>

      {/* Contenu principal */}
      <main
        className="flex-1 p-8"
        style={{
          marginTop: '3rem',
          background:
            'linear-gradient(to bottom right, rgba(0,255,246,0.04), rgba(0,217,163,0.03))',
          boxShadow: 'inset 0 0 20px rgba(0,255,246,0.1)',
          borderRadius: '10px',
        }}
      >
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <UserProvider>
          <LayoutContent>{children}</LayoutContent>
        </UserProvider>
      </body>
    </html>
  )
}
