import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    const cursor = searchParams.get('cursor')

    const apiKey = process.env.VIRUSTOTAL_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { message: 'Clé API VirusTotal manquante' },
        { status: 500 }
      )
    }

    // Construction de l'URL avec les paramètres
    let url = 'https://www.virustotal.com/api/v3/attack_techniques'
    const params = new URLSearchParams()
    
    if (limit) params.append('limit', limit.toString())
    if (cursor) params.append('cursor', cursor)
    if (query) params.append('query', query)

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const response = await fetch(url, {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY ?? "",
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('VirusTotal API error:', errorText)
      return NextResponse.json(
        { message: `Erreur VirusTotal: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600',
      },
    })
  } catch (err) {
    console.error('Erreur API VirusTotal:', err)
    const message = err instanceof Error ? err.message : 'Erreur serveur'
    return NextResponse.json({ message }, { status: 500 })
  }
}