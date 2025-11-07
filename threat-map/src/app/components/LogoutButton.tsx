
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
      className="px-4 py-2 font-semibold text-white rounded-lg 
                   bg-gradient-to-r from-rose-700 to-red-700 
                   hover:from-rose-600 hover:to-red-600 
                   border border-red-500/30 
                   transition-all duration-200"
    >
      Déconnexion
     </button>
    </div>
  )
}

