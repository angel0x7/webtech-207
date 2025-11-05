'use client';
import React, { useState, useEffect } from 'react';

interface CVERegistryItem {
  id: string;
  short_name: string;
  full_name: string;
  cpe_vendor_name?: string;
  gcve_url?: string;
  gcve_api?: string;
  gcve_dump?: string;
  gcve_allocation?: string;
  gcve_pull_api?: string;
}

interface CVERegistryResponse {
  metadata: {
    count: number;
    page: number;
    per_page: number;
  };
  data: CVERegistryItem[];
}

export default function CVEPage() {
  const [data, setData] = useState<CVERegistryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCVE, setSelectedCVE] = useState<CVERegistryItem | null>(null);
  const [cveId, setCveId] = useState('');

  useEffect(() => {
    fetchLatest();
  }, []);

  async function fetchLatest() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gcve/registry', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const json: CVERegistryResponse = await res.json();
      if (json && Array.isArray(json.data)) {
        setData(json.data);
      } else {
        setData([]);
        setError('Format inattendu de la réponse API');
      }
    } catch (e) {
      console.error(e);
      setError('Erreur de chargement du registre GCVE');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCVEById(idParam?: string) {
    const id = idParam || cveId;
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/getCVEById?id=${id}`);
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const json: CVERegistryItem = await res.json();
      setSelectedCVE(json);
    } catch (e) {
      console.error(e);
      setError('Erreur lors du chargement du CVE');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Threat Intelligence – CVE Registry</h1>

      {/* Search bar */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Rechercher un ID ou vendor"
          value={cveId}
          onChange={(e) => setCveId(e.target.value)}
          style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '8px', width: '300px' }}
        />
        <button
          onClick={() => fetchCVEById()}
          style={{ padding: '0.75rem 1.25rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Rechercher
        </button>
        <button
          onClick={() => { setSelectedCVE(null); fetchLatest(); }}
          style={{ padding: '0.75rem 1.25rem', background: '#555', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Derniers Registres
        </button>
      </div>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      {loading && <p style={{ marginTop: '1rem' }}>Chargement...</p>}

      {/* Selected CVE */}
      {selectedCVE && !loading && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fafafa' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{selectedCVE.id || 'CVE Details'}</h2>
          <p><strong>Nom complet :</strong> {selectedCVE.full_name}</p>
          <p><strong>Short Name :</strong> {selectedCVE.short_name}</p>
          <p><strong>Vendor :</strong> {selectedCVE.cpe_vendor_name || '-'}</p>
          {selectedCVE.gcve_url && <p><a href={selectedCVE.gcve_url} target="_blank" rel="noopener noreferrer">Lien GCVE</a></p>}
          <button
            onClick={() => setSelectedCVE(null)}
            style={{ marginTop: '1rem', padding: '0.75rem 1.25rem', background: '#555', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Retour
          </button>
        </div>
      )}

      {/* Table */}
      {!selectedCVE && !loading && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Derniers registres GCVE</h2>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', maxHeight: '70vh', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f2f2f2' }}>
                <tr>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Short Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Full Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Vendor</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Lien</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderTop: '1px solid #eee', cursor: 'pointer', transition: 'background 0.2s' }}
                    onClick={() => fetchCVEById(item.id)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    <td style={{ padding: '0.75rem', color: '#0070f3' }}>{item.id}</td>
                    <td style={{ padding: '0.75rem' }}>{item.short_name}</td>
                    <td style={{ padding: '0.75rem', maxWidth: '600px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.full_name}</td>
                    <td style={{ padding: '0.75rem' }}>{item.cpe_vendor_name || '-'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      {item.gcve_url ? <a href={item.gcve_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>Voir</a> : '-'}
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
