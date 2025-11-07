'use client'

import { useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'

export default function ProfileButton() {
  const router = useRouter()
  const { user } = useUser()

  if (!user) return null

  const handleProfile = () => {
    router.push('/profile')
  }

  return (
    <div className="absolute top-2 right-[160px] z-[200] flex gap-3">
      <button
        onClick={handleProfile}
        className="px-4 py-2 font-semibold text-white rounded-lg 
                   bg-gradient-to-r from-cyan-700 to-emerald-700 
                   hover:from-cyan-600 hover:to-emerald-600 
                   border border-cyan-500/30 
                   transition-all duration-200"
      >
        Profil
      </button>
    </div>
  )
}
