'use client'

import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { getUserProfile, upsertUserProfile, uploadAvatar } from '../lib/profil'
import type { UserProfile } from '../lib/types'
import { useTranslation } from 'react-i18next'
import '../lib/i18n'

export default function ProfilePage() {
  const { user, theme, setTheme } = useUser()
  const { t, i18n } = useTranslation()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    if (!user) return
    getUserProfile(user.id)
      .then((data) => {
        setProfile(data)
        setUsername(data?.username || '')
        setBio(data?.bio || '')
        setAvatarUrl(data?.avatar_url || '')
        setTheme(data?.theme || 'system')
        setLanguage(data?.language || 'en')
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : JSON.stringify(err)))
      .finally(() => setLoading(false))
  }, [user, setTheme])

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return
    const file = e.target.files[0]
    try {
      const url = await uploadAvatar(user.id, file)
      setAvatarUrl(url)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }

  const handleSave = async () => {
    if (!user) return
    try {
      await upsertUserProfile({
        id: user.id,
        username,
        bio,
        avatar_url: avatarUrl,
        theme,
        language,
      })
      alert('Profil mis à jour !')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }

  if (loading) return <p className="text-white text-center mt-8">Chargement...</p>
  if (!user) return <p className="text-white text-center mt-8">Connectez-vous pour voir votre profil.</p>

  return (
    <div className="min-h-screen flex justify-center items-start p-8 bg-gray-950">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-lg space-y-6">
        {error && <p className="text-red-500 text-center">{error}</p>}

        <h1 className="text-3xl font-bold text-white text-center">{t('profile')}</h1>

        <div className="flex flex-col items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full border-2 border-blue-600 object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
              Avatar
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="text-gray-200 text-sm" />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-gray-300 font-medium">{t('username')}</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-gray-300 font-medium">{t('bio')}</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-gray-300 font-medium">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
            <option value="system">Système</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-gray-300 font-medium">Langue</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
        >
          {t('save')}
        </button>
      </div>
    </div>
  )
}
