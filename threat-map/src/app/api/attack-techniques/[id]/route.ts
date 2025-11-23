import { NextRequest, NextResponse } from 'next/server'
//
type AttackTechniqueInfo = {
  x_mitre_detection?: string
  x_mitre_platforms?: string[]
  x_mitre_data_sources?: string[]
  x_mitre_is_subtechnique?: boolean
  x_mitre_system_requirements?: string
  x_mitre_tactic_type?: string
  x_mitre_permissions_required?: string[]
  x_mitre_effective_permissions?: string[]
  x_mitre_defense_bypassed?: string[]
  x_mitre_remote_support?: boolean
  x_mitre_impact_type?: string[]
  x_mitre_version?: string
  x_mitre_contributors?: string[]
  x_mitre_deprecated?: boolean
  x_mitre_old_attack_id?: string
  x_mitre_network_requirements?: boolean
}

type AttackTechniqueAttributes = {
  info: AttackTechniqueInfo
  revoked: boolean
  name: string
  creation_date: number
  link: string
  stix_id: string
  last_modification_date: number
  description: string
}

type AttackTechniqueData = {
  attributes: AttackTechniqueAttributes
  type: string
  id: string
  links: {
    self: string
  }
}

type AttackTechniqueResponse = {
  data: AttackTechniqueData
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Récupérer l'ID depuis les params
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { message: 'ID de la technique requis (ex: T1110, T1110.001)' },
        { status: 400 }
      )
    }

    // Validation du format ID (Txxxx ou Txxxx.xxx)
    const idPattern = /^T\d{4}(\.\d{3})?$/
    if (!idPattern.test(id)) {
      return NextResponse.json(
        { message: 'Format ID invalide. Exemple: T1110 ou T1110.001' },
        { status: 400 }
      )
    }

    // Vérifier la clé API
    const apiKey = process.env.VirusTotal_API_Key

    if (!apiKey) {
      return NextResponse.json(
        { message: 'Clé API VirusTotal manquante' },
        { status: 500 }
      )
    }

    // Appel à l'API VirusTotal
    const response = await fetch(
      `https://www.virustotal.com/api/v3/attack_techniques/${id}`,
      {
        headers: {
          'x-apikey': apiKey,
          'Accept': 'application/json',
        },
        // Cache pour 1 heure (les techniques changent rarement)
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { message: `Technique d'attaque "${id}" introuvable` },
          { status: 404 }
        )
      }

      const errorText = await response.text()
      console.error('VirusTotal API error:', errorText)
      return NextResponse.json(
        { message: `Erreur VirusTotal: ${response.status}` },
        { status: response.status }
      )
    }

    const data: AttackTechniqueResponse = await response.json()

    // Enrichir la réponse avec des métadonnées utiles
    const enrichedData = {
      ...data,
      meta: {
        requested_id: id,
        is_subtechnique: id.includes('.'),
        parent_technique: id.includes('.') ? id.split('.')[0] : null,
        cached: true,
      },
    }

    return NextResponse.json(enrichedData, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    console.error('Erreur API VirusTotal Attack Techniques:', err)
    const message = err instanceof Error ? err.message : 'Erreur serveur'
    return NextResponse.json({ message }, { status: 500 })
  }
}