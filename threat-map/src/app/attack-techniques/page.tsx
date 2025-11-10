'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const popularTechniques = [
  { id: 'T1110', name: 'Brute Force', description: 'Adversaries may use brute force techniques' },
  { id: 'T1059', name: 'Command and Scripting', description: 'Adversaries may abuse command' },
  { id: 'T1566', name: 'Phishing', description: 'Adversaries may send phishing messages' },
  { id: 'T1055', name: 'Process Injection', description: 'Adversaries may inject code' },
  { id: 'T1003', name: 'Credential Dumping', description: 'Adversaries may attempt to dump credentials' },
]

export default function AttackTechniquesSearchPage() {
  const router = useRouter()
  const [techniqueId, setTechniqueId] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (techniqueId.trim()) {
      router.push(`/attack-techniques/${techniqueId.trim().toUpperCase()}`)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{
            color: '#00fff6',
            textShadow: '0 0 20px rgba(0, 255, 246, 0.5)',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          MITRE ATT&CK Techniques
        </h1>
        <p className="text-gray-400 mb-8">
          Recherchez et explorez les techniques d&apos;attaque référencées par MITRE
        </p>

        {/* Formulaire de recherche */}
        <form
          onSubmit={handleSearch}
          className="p-6 rounded-lg mb-8"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(0, 255, 246, 0.3)',
            boxShadow: '0 0 20px rgba(0, 255, 246, 0.1)',
          }}
        >
          <label className="block text-sm font-medium text-cyan-300 mb-2">
            Rechercher par ID (ex: T1110 ou T1110.001)
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={techniqueId}
              onChange={(e) => setTechniqueId(e.target.value)}
              placeholder="T1110"
              className="flex-1 p-3 rounded-lg border text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition uppercase"
              style={{
                backgroundColor: 'rgba(10, 15, 20, 0.9)',
                borderColor: 'rgba(0, 255, 246, 0.3)',
              }}
              pattern="T\d{4}(\.\d{3})?"
            />
            <button
              type="submit"
              disabled={!techniqueId.trim()}
              className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: techniqueId.trim()
                  ? 'linear-gradient(90deg, #00fff6 0%, #00d9a3 100%)'
                  : '#1e293b',
                color: techniqueId.trim() ? '#0a0f14' : '#64748b',
              }}
            >
              Rechercher
            </button>
          </div>
        </form>

        {/* Techniques populaires */}
        <div>
          <h2 className="text-2xl font-bold text-cyan-300 mb-4">Techniques populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularTechniques.map((tech) => (
              <button
                key={tech.id}
                onClick={() => router.push(`/attack-techniques/${tech.id}`)}
                className="p-4 rounded-lg text-left transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(0, 255, 246, 0.2)',
                  boxShadow: '0 0 10px rgba(0, 255, 246, 0.05)',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="px-3 py-1 rounded font-bold text-sm"
                    style={{
                      background: 'linear-gradient(90deg, #00fff6 0%, #00d9a3 100%)',
                      color: '#0a0f14',
                    }}
                  >
                    {tech.id}
                  </span>
                  <h3 className="text-lg font-semibold text-cyan-300">{tech.name}</h3>
                </div>
                <p className="text-gray-400 text-sm">{tech.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
