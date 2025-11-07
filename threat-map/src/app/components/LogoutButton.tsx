
'use client'

import { useUser } from '../context/UserContext'

export default function LogoutButton() {
  const { signOut } = useUser()

  const handleLogout = async () => {
    try {
      await signOut()
      
      window.location.href = '/'
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error)
    }
  }

  return (
    <div className="absolute top-2 right-6 z-[200] flex gap-3">
     <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all"
    >
      Déconnexion
     </button>
    </div>
  )
}

