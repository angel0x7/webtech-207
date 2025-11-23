'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'
import { getUserProfile, upsertUserProfile, uploadAvatar } from '../lib/profil'
import type { UserProfile } from '../lib/types'
import { useTranslation } from 'react-i18next'
import '../lib/i18n'

export default function ProfilePage() {
  const router = useRouter()
  const { user, theme, setTheme } = useUser()
  const { t, i18n } = useTranslation()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [language, setLanguage] = useState('en')

  // Redirection si non connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Chargement du profil
  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(user.id)
        setProfile(data)
        setUsername(data?.username || '')
        setBio(data?.bio || '')
        setAvatarUrl(data?.avatar_url || '')
        setTheme(data?.theme || 'system')
        setLanguage(data?.language || 'en')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement du profil'
        setError(message)
        console.error('Erreur récupération profil:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, setTheme])

  // Changement de langue test 
  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return
    
    const file = e.target.files[0]
    
    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB max
      setError('L\'image ne doit pas dépasser 5MB')
      return
    }

    setError(null)
    setUploadingAvatar(true)

    try {
      const url = await uploadAvatar(user.id, file)
      setAvatarUrl(url)
      setSuccessMessage('Avatar mis à jour avec succès !')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors du téléchargement'
      setError(message)
      console.error('Erreur upload avatar:', err)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    // Validation
    if (!username.trim()) {
      setError('Le nom d\'utilisateur est requis')
      return
    }

    if (username.length < 3) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères')
      return
    }

    setError(null)
    setSaving(true)

    try {
      await upsertUserProfile({
        id: user.id,
        username: username.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl,
        theme,
        language,
      })
      
      setSuccessMessage('Profil mis à jour avec succès !')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
      setError(message)
      console.error('Erreur sauvegarde profil:', err)
    } finally {
      setSaving(false)
    }
  }

// Affichage pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-cyan-300 text-lg font-semibold">Chargement du profil...</p>
        </div>
      </div>
    )
  }

// Invitation à se connecter si non authentifié
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="text-cyan-300 text-xl mb-4">Connectez-vous pour voir votre profil</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-gray-900 font-semibold rounded-lg hover:from-cyan-300 hover:to-blue-500 transition-all"
          >
            Se connecter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex justify-center items-start p-4 md:p-8"
      style={{
        backgroundColor: '#0a0f14',
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,255,246,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,217,163,0.08) 0%, transparent 40%)',
      }}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl p-6 md:p-8 space-y-6 mt-8"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(0, 255, 246, 0.3)',
          boxShadow: '0 0 30px rgba(0, 255, 246, 0.15)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Messages */}
        {error && (
          <div className="p-4 rounded-lg bg-red-900/20 border border-red-700/30 animate-pulse">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-lg bg-green-900/20 border border-green-700/30 animate-pulse">
            <p className="text-green-400 text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </p>
          </div>
        )}

        {/* Titre */}
        <h1 
          className="text-3xl md:text-4xl font-bold text-center"
          style={{
            color: '#00fff6',
            textShadow: '0 0 10px rgba(0, 255, 246, 0.5)',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {t('profile')}
        </h1>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {avatarUrl ? (
              <div
                className="rounded-full p-[3px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,255,246,0.8), rgba(0,217,163,0.8))',
                  boxShadow: '0 0 20px rgba(0,255,246,0.4)',
                }}
              >
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="w-32 h-32 rounded-full object-cover bg-gray-900"
                />
              </div>
            ) : (
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center text-cyan-400 border-2"
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  borderColor: 'rgba(0, 255, 246, 0.3)',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <label className="cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
              className="hidden"
            />
            <span 
              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all inline-block"
              style={{
                background: 'linear-gradient(90deg, rgba(0,255,246,0.2) 0%, rgba(0,217,163,0.2) 100%)',
                border: '1px solid rgba(0, 255, 246, 0.3)',
                color: '#00fff6',
              }}
            >
              {uploadingAvatar ? 'Téléchargement...' : 'Changer l\'avatar'}
            </span>
          </label>
        </div>

        {/* Formulaire */}
        <div className="space-y-4">
          {/* Username */}
          <div className="flex flex-col space-y-2">
            <label className="text-cyan-300 font-medium text-sm">{t('username')}</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={saving}
              required
              minLength={3}
              maxLength={30}
              className="w-full p-3 rounded-lg border text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition disabled:opacity-50"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: 'rgba(0, 255, 246, 0.3)',
              }}
              placeholder="Votre nom d'utilisateur"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col space-y-2">
            <label className="text-cyan-300 font-medium text-sm">{t('bio')}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={saving}
              rows={4}
              maxLength={500}
              className="w-full p-3 rounded-lg border text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition disabled:opacity-50 resize-none"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: 'rgba(0, 255, 246, 0.3)',
              }}
              placeholder="Parlez-nous de vous..."
            />
            <p className="text-gray-500 text-xs text-right">{bio.length}/500</p>
          </div>

          {/* Thème */}
          <div className="flex flex-col space-y-2">
            <label className="text-cyan-300 font-medium text-sm">Thème</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              disabled={saving}
              className="w-full p-3 rounded-lg border text-gray-100 focus:outline-none focus:ring-2 transition disabled:opacity-50"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: 'rgba(0, 255, 246, 0.3)',
              }}
            >
              <option value="light">☀️ Clair</option>
              <option value="dark">🌙 Sombre</option>
              <option value="system">💻 Système</option>
            </select>
          </div>

          {/* Langue */}
          <div className="flex flex-col space-y-2">
            <label className="text-cyan-300 font-medium text-sm">Langue</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={saving}
              className="w-full p-3 rounded-lg border text-gray-100 focus:outline-none focus:ring-2 transition disabled:opacity-50"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: 'rgba(0, 255, 246, 0.3)',
              }}
            >
              <option value="en">🇬🇧 English</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="es">🇪🇸 Español</option>
            </select>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => router.push('/')}
            disabled={saving}
            className="flex-1 py-3 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: 'rgba(107, 114, 128, 0.2)',
              border: '1px solid rgba(107, 114, 128, 0.3)',
              color: '#d1d5db',
            }}
          >
            Annuler
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !username.trim()}
            className="flex-1 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: saving ? '#1e293b' : 'linear-gradient(90deg, #00fff6 0%, #00d9a3 100%)',
              color: saving ? '#64748b' : '#0a0f14',
              boxShadow: saving ? 'none' : '0 0 15px rgba(0, 255, 246, 0.6)',
            }}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sauvegarde...
              </span>
            ) : (
              t('save')
            )}
          </button>
        </div>
      </div>
    </div>
  )
}