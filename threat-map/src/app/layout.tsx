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
        if (!data) return
        setProfile(data)
      } catch (err: any) {
        console.error('Erreur récupération profil :', err?.message ?? err)
      }
    }

    fetchProfile()
  }, [user])

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />


      <div className="absolute top-4 right-6 flex items-center gap-3">
        {!user ? (
          <LoginButton />
        ) : (
          <>

            {profile?.avatar_url && (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            )}


            {profile?.username && <span className="text-white font-semibold">{profile.username}</span>}

 
            <button
              onClick={() => router.push('/profile')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-1 rounded transition"
            >
              Profil
            </button>


            <LogoutButton />
          </>
        )}
      </div>

      <main className="flex-1 p-8">{children}</main>

      <Footer />
    </div>
  )
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <LayoutContent>{children}</LayoutContent>
        </UserProvider>
      </body>
    </html>
  )
}
