import { NextResponse } from 'next/server'
import { supabase } from '../../config/supabaseClient'

// Gestion du callback OAuth de Supabase
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/', request.url))
}