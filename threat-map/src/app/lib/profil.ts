import { supabase } from '../config/supabaseClient'

// Récupérer le profil
// src/lib/profile.ts
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle() // ← change ici

  if (error) throw error
  return data // peut être null si pas de profil
}


// Créer / mettre à jour le profil
export const upsertUserProfile = async (profile: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
  if (error) throw error
  return data
}

// Upload avatar
export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/avatar.${fileExt}`

  // Upload
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) throw uploadError

  // Récupérer l'URL publique
  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

  return data.publicUrl
}


