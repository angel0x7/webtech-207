'use client'
// Layout principal de l’application avec gestion utilisateur et style global ainsi que la navbar fixe
import { ReactNode, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/footer'
import LoginButton from './components/loginBoton'
import LogoutButton from './components/LogoutButton'
import ProfileButton from './components/profilButton'
import { useUser, UserProvider } from './context/UserContext'
import { getUserProfile } from './lib/profil'
import { useRouter } from 'next/navigation'
import './globals.css'

function LayoutContent({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [profile, setProfile] = useState<{ username?: string; avatar_url?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

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
      {/* Navbar fixe en haut */}
      <div className="fixed top-0 left-0 w-full z-40">
        <Navbar />
      </div>

      {/* Zone utilisateur, au-dessus du contenu */}
      <div className="fixed top-3 right-6 flex items-center gap-3 z-50">
        {!user ? (
          <LoginButton />
        ) : (
          <>
            {/* Avatar et nom d’utilisateur */}
            {profile && (
              <div className="flex items-center gap-3">
                {profile.avatar_url && (
                  <div
                    className="rounded-full p-[2px]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,255,246,0.6), rgba(0,217,163,0.6))',
                    }}
                  >
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover cursor-pointer"
                      onClick={() => router.push('/profile')}
                      title="Voir le profil"
                    />
                  </div>
                )}
                
              </div>
            )}

            {/* Boutons profil et déconnexion */}
            <ProfileButton />
            <LogoutButton />
          </>
        )}
      </div>

      {/* Contenu principal */}
      <main
        className="flex-1 p-8 mt-24"
        style={{
          background: 'linear-gradient(to bottom right, rgba(0,255,246,0.04), rgba(0,217,163,0.03))',
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
