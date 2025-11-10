import React from 'react'
import { notFound } from 'next/navigation'

interface AttackTechniquePageProps {
  params: { id: string }
}

async function getAttackTechnique(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/attack-techniques/${id}`, {
    cache: 'no-store', // Toujours frais
  })

  if (!res.ok) {
    if (res.status === 404) notFound()
    throw new Error(`Erreur ${res.status}`)
  }

  return res.json()
}

export default async function AttackTechniquePage({ params }: AttackTechniquePageProps) {
  const { id } = await params
  const data = await getAttackTechnique(id)

  const tech = data.data.attributes

  return (
    <div className="min-h-screen p-6 md:p-10 text-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-4xl font-bold mb-4"
          style={{
            color: '#00fff6',
            textShadow: '0 0 20px rgba(0, 255, 246, 0.5)',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {tech.name} <span className="text-cyan-500">({id})</span>
        </h1>

        <p className="text-gray-400 mb-6 leading-relaxed">{tech.description}</p>

        <div
          className="p-4 rounded-lg mb-6"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(0, 255, 246, 0.2)',
          }}
        >
          <h2 className="text-xl font-semibold text-cyan-300 mb-3">
            Informations techniques
          </h2>
          <ul className="space-y-1 text-sm text-gray-300">
            {tech.info?.x_mitre_platforms && (
              <li>
                <span className="font-semibold text-cyan-400">Plateformes :</span>{' '}
                {tech.info.x_mitre_platforms.join(', ')}
              </li>
            )}
            {tech.info?.x_mitre_permissions_required && (
              <li>
                <span className="font-semibold text-cyan-400">Permissions requises :</span>{' '}
                {tech.info.x_mitre_permissions_required.join(', ')}
              </li>
            )}
            {tech.info?.x_mitre_detection && (
              <li>
                <span className="font-semibold text-cyan-400">Détection :</span>{' '}
                {tech.info.x_mitre_detection}
              </li>
            )}
          </ul>
        </div>

        <a
          href={tech.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-cyan-400 hover:text-cyan-300 underline"
        >
          Voir sur VirusTotal
        </a>
      </div>
    </div>
  )
}
