"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'


// Typage des props
interface AttackTechniquePageProps {
  params: Promise<{ id: string }>
}
// Typage des données API
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
  data: {
    attributes: AttackTechniqueAttributes
    type: string
    id: string
    links: {
      self: string
    }
  }
  meta?: {
    requested_id: string
    is_subtechnique: boolean
    parent_technique: string | null
    cached: boolean
  }
}

export default function AttackTechniquePage({ params }: AttackTechniquePageProps) {
  const router = useRouter()
  const [id, setId] = useState<string>('')
  const [technique, setTechnique] = useState<AttackTechniqueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Résoudre les params
  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id)
    })
  }, [params])

  // Charger la technique quand l'ID est disponible
  useEffect(() => {
    if (!id) return

    const loadTechnique = async () => {
      setLoading(true)
      setError(null)

      try {
        //  Chemin relatif sans NEXT_PUBLIC_BASE_URL
        const response = await fetch(`/api/attack-techniques/${id}`, {
          cache: 'no-store',
        })

        if (!response.ok) {
          if (response.status === 404) {
            setError('Technique introuvable')
            return
          }
          const errorData = await response.json()
          throw new Error(errorData.message || `Erreur ${response.status}`)
        }

        const data: AttackTechniqueData = await response.json()
        setTechnique(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur de chargement'
        setError(message)
        console.error('Erreur chargement technique:', err)
      } finally {
        setLoading(false)
      }
    }

    loadTechnique()
  }, [id])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-cyan-300 text-lg font-semibold">
            Chargement de la technique {id}...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="p-6 rounded-lg bg-red-900/20 border border-red-700/30">
            <svg
              xmlns="http://www.w3.org/2000/svg" // SVG d'icône d'erreur
              className="h-16 w-16 mx-auto mb-4 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Erreur</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg font-semibold transition-all bg-gray-700 hover:bg-gray-600 text-white"
              >
                Retour
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 rounded-lg font-semibold transition-all"
                style={{
                  background: 'linear-gradient(90deg, #00fff6 0%, #00d9a3 100%)',
                  color: '#0a0f14',
                }}
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!technique) return null

  const tech = technique.data.attributes

  return (
    <div className="min-h-screen p-6 md:p-10 text-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Bouton retour */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Retour
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1
              className="text-4xl font-bold"
              style={{
                color: '#00fff6',
                textShadow: '0 0 20px rgba(0, 255, 246, 0.5)',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              {tech.name}
            </h1>
            <span
              className="px-3 py-1 rounded font-bold text-sm"
              style={{
                background: 'linear-gradient(90deg, #00fff6 0%, #00d9a3 100%)',
                color: '#0a0f14',
              }}
            >
              {id}
            </span>
          </div>

          {/* Badges */}
          <div className="flex gap-2 mb-4">
            {tech.revoked && (
              <span className="px-3 py-1 rounded bg-red-900/30 text-red-400 text-sm font-bold">
                RÉVOQUÉ
              </span>
            )}
            {tech.info?.x_mitre_deprecated && (
              <span className="px-3 py-1 rounded bg-orange-900/30 text-orange-400 text-sm font-bold">
                OBSOLÈTE
              </span>
            )}
            {tech.info?.x_mitre_is_subtechnique && (
              <span className="px-3 py-1 rounded bg-blue-900/30 text-blue-400 text-sm font-bold">
                SOUS-TECHNIQUE
              </span>
            )}
          </div>

          <p className="text-sm text-gray-400">STIX ID: {tech.stix_id}</p>
        </div>

        {/* Description */}
        <div
          className="p-6 rounded-lg mb-6"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(0, 255, 246, 0.3)',
            boxShadow: '0 0 20px rgba(0, 255, 246, 0.1)',
          }}
        >
          <h2 className="text-xl font-semibold text-cyan-300 mb-3">Description</h2>
          <p className="text-gray-300 leading-relaxed">{tech.description}</p>
        </div>

        {/* Informations techniques */}
        <div
          className="p-6 rounded-lg mb-6"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(0, 255, 246, 0.2)',
          }}
        >
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">
            Informations techniques
          </h2>
          <div className="space-y-3">
            {tech.info?.x_mitre_platforms && tech.info.x_mitre_platforms.length > 0 && (
              <div>
                <span className="font-semibold text-cyan-400 block mb-2">Plateformes :</span>
                <div className="flex flex-wrap gap-2">
                  {tech.info.x_mitre_platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1 rounded text-sm"
                      style={{
                        backgroundColor: 'rgba(0, 255, 246, 0.1)',
                        color: '#00fff6',
                        border: '1px solid rgba(0, 255, 246, 0.3)',
                      }}
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tech.info?.x_mitre_permissions_required && tech.info.x_mitre_permissions_required.length > 0 && (
              <div>
                <span className="font-semibold text-cyan-400 block mb-2">
                  Permissions requises :
                </span>
                <div className="flex flex-wrap gap-2">
                  {tech.info.x_mitre_permissions_required.map((perm) => (
                    <span
                      key={perm}
                      className="px-3 py-1 rounded bg-orange-900/30 text-orange-300 text-sm"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tech.info?.x_mitre_data_sources && tech.info.x_mitre_data_sources.length > 0 && (
              <div>
                <span className="font-semibold text-cyan-400 block mb-2">
                  Sources de données :
                </span>
                <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                  {tech.info.x_mitre_data_sources.map((source) => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
              </div>
            )}

            {tech.info?.x_mitre_detection && (
              <div>
                <span className="font-semibold text-cyan-400 block mb-2">Détection :</span>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {tech.info.x_mitre_detection}
                </p>
              </div>
            )}

            {tech.info?.x_mitre_defense_bypassed && tech.info.x_mitre_defense_bypassed.length > 0 && (
              <div>
                <span className="font-semibold text-cyan-400 block mb-2">
                  Défenses contournées :
                </span>
                <div className="flex flex-wrap gap-2">
                  {tech.info.x_mitre_defense_bypassed.map((defense) => (
                    <span
                      key={defense}
                      className="px-3 py-1 rounded bg-red-900/30 text-red-300 text-sm"
                    >
                      {defense}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Liens externes */}
        <div className="flex gap-3">
          <a
            href={tech.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              background: 'linear-gradient(90deg, #00fff6 0%, #00d9a3 100%)',
              color: '#0a0f14',
            }}
          >
            Voir sur MITRE ATT&CK
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /> // SVG d'icône de lien externe
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /> 
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}