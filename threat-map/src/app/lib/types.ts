
export interface UserProfile {
  id: string
  username?: string
  bio?: string
  avatar_url?: string
  theme?: 'light' | 'dark' | 'system'| 'theme'
  language?: string
}
