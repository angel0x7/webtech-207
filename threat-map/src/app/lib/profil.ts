import { supabase } from '../config/supabaseClient'

export interface UserProfile {
  id: string
  username?: string
  email?: string
  avatar_url?: string
  // ajoute ici les autres champs de ta table profiles
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export const upsertUserProfile = async (profile: UserProfile): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()

  if (error) throw error


  if (Array.isArray(data) && data.length > 0) {
    return data[0] as UserProfile
  }

  return null
}


export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/avatar.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
  return data.publicUrl
}
