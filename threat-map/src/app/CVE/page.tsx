'use client';
import React, { useState, useEffect } from 'react';

interface CVERegistryItem {
  id: string;
  short_name: string;
  full_name: string;
  cpe_vendor_name?: string;
  gcve_url?: string;
}

interface CVERegistryResponse {
  metadata: { count: number; page: number; per_page: number };
  data: CVERegistryItem[];
}

interface NormalizedCVE {
  id: string;
  title: string;
  description: string;
  published: string;
  modified: string;
  vendors: string[];
  products: string[];
  references: string[];
}

export default function CVEPage() {
  const [data, setData] = useState<CVERegistryItem[]>([]); // Données du registre GCVE
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState('');
  const [selectedCVE, setSelectedCVE] = useState<NormalizedCVE | null>(null); // CVE sélectionné
  const [cveId, setCveId] = useState('');

  useEffect(() => {
    fetchLatest();// Charger les derniers registres
  }, []);

  async function fetchLatest() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gcve/registry', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const json: CVERegistryResponse = await res.json();
      setData(json.data ?? []);
    } catch (e) {
      console.error(e);
      setError('Erreur de chargement du registre GCVE');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCVEById(idParam?: string) {
    const id = idParam || cveId.trim();
    if (!id) {
      setError('Veuillez entrer un identifiant CVE valide');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedCVE(null);

    const isValidCVE = /^CVE-\d{4}-\d+$/i.test(id);

    try {
      if (isValidCVE) {
        const res = await fetch(`/api/getCVEById?id=${encodeURIComponent(id)}`, { cache: 'no-store' });// Appel API pour CVE officiel
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        const json: NormalizedCVE = await res.json();
        setSelectedCVE(json);
      } else {
        const item = data.find((d) => d.id === id); // Recherche dans le registre GCVE
        if (item) {
          setSelectedCVE({
            id: item.id,
            title: item.full_name || item.short_name || '(Sans titre)',
            description: 'Entrée GCVE interne, pas de détails CVE disponibles.',
            published: '-',
            modified: '-',
            vendors: item.cpe_vendor_name ? [item.cpe_vendor_name] : [],
            products: [],
            references: item.gcve_url ? [item.gcve_url] : [],
          });
        } else {
          setError('Aucune donnée correspondante trouvée dans le registre.');
        }
      }
    } catch (e) {
      console.error(e);
      setError('Erreur lors du chargement du CVE');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: '"JetBrains Mono", monospace',
        backgroundColor: '#0a0f14',
        color: '#d7f9f1',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#00fff6',
          textShadow: '0 0 10px #00fff6',
        }}
      >
        Threat Intelligence – CVE Registry
      </h1>

      {/* Barre de recherche */}
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Rechercher un ID CVE (ex: CVE-2023-44487)"
          value={cveId}
          onChange={(e) => setCveId(e.target.value)}
          style={{
            padding: '0.75rem',
            border: '1px solid #00fff6',
            borderRadius: '6px',
            background: '#0d141b',
            color: '#00fff6',
            width: '300px',
            outline: 'none',
          }}
        />
        <button
          onClick={() => fetchCVEById()}
          style={{
            padding: '0.75rem 1.25rem',
            background: '#00d9a3',
            color: '#0a0f14',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 10px #00d9a3',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}// Agrandir au survol
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        >
          Rechercher
        </button>
        <button
          onClick={() => {
            setSelectedCVE(null);
            fetchLatest();
          }}
          style={{
            padding: '0.75rem 1.25rem',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 0 10px #0070f3',
          }}
        >
          Derniers Registres
        </button>
      </div>

      {error && <p style={{ color: '#ff6666', marginTop: '1rem' }}>{error}</p>}
      {loading && <p style={{ marginTop: '1rem', color: '#00d9a3' }}>Chargement...</p>}

      {/* Détails CVE */}
      {selectedCVE && !loading && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            border: '1px solid #00fff6',
            borderRadius: '10px',
            background: '#0d141b',
            boxShadow: '0 0 20px rgba(0,255,246,0.2)',
          }}
        >
          <h2 style={{ color: '#00fff6' }}>{selectedCVE.id}</h2>
          <p><strong>Titre :</strong> {selectedCVE.title || '-'}</p>
          <p><strong>Description :</strong> {selectedCVE.description || '-'}</p>
          <p><strong>Publié :</strong> {selectedCVE.published || '-'}</p>
          <p><strong>Modifié :</strong> {selectedCVE.modified || '-'}</p>
          <p><strong>Vendors :</strong> {selectedCVE.vendors.join(', ') || '-'}</p>
          <p><strong>Produits :</strong> {selectedCVE.products.join(', ') || '-'}</p>
          <p><strong>Références :</strong></p>
          <ul>
            {selectedCVE.references.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#00d9a3' }}>
                  {url}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setSelectedCVE(null)}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.25rem',
              background: '#00fff6',
              color: '#0a0f14',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 0 10px #00fff6',
            }}
          >
            Retour
          </button>
        </div>
      )}

      {/* Table GCVE */}
      {!selectedCVE && !loading && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#00d9a3', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Derniers registres GCVE
          </h2>
          <div
            style={{
              border: '1px solid #00d9a3',
              borderRadius: '8px',
              overflow: 'hidden',
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#0f171e' }}>
                <tr>
                  {['ID', 'Short Name', 'Full Name', 'Vendor', 'Lien'].map((h) => (
                    <th key={h} style={{ padding: '0.75rem', color: '#00fff6', textAlign: 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => (
                  <tr
                    key={item.id}
                    style={{
                      background: i % 2 === 0 ? '#0a0f14' : '#111820',
                      borderTop: '1px solid #1c2a35',
                      cursor: 'pointer',
                      transition: 'background 0.2s, transform 0.2s',
                    }}
                    onClick={() => fetchCVEById(item.id)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#0d2029')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? '#0a0f14' : '#111820')}
                  >
                    <td style={{ padding: '0.75rem', color: '#00fff6' }}>{item.id}</td>
                    <td style={{ padding: '0.75rem' }}>{item.short_name}</td>
                    <td style={{ padding: '0.75rem' }}>{item.full_name}</td>
                    <td style={{ padding: '0.75rem' }}>{item.cpe_vendor_name || '-'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      {item.gcve_url ? (
                        <a href={item.gcve_url} target="_blank" rel="noopener noreferrer" style={{ color: '#00d9a3' }}>
                          Voir
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
