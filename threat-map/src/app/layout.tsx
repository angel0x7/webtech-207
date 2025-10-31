// src/app/layout.tsx
'use client'

import { ReactNode } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/footer'
import LoginButton from './components/loginBoton'
import LogoutButton from './components/LogoutButton'
import { UserProvider, useUser } from './context/UserContext'
import './globals.css'

function LayoutContent({ children }: { children: ReactNode }) {
  const { user } = useUser()

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />

      {/* Affiche LoginButton si non connecté, LogoutButton si connecté */}
      <div className=" absolute top-4 right-6">
        {!user ? <LoginButton /> : <LogoutButton />}
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
