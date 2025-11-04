'use client';
import React, { useState, useEffect } from 'react';

interface CVEItem {
  id: string;
  summary: string;
  Published: string;
  Modified: string;
}

export default function CVEPage() {
  const [data, setData] = useState<CVEItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCVE, setSelectedCVE] = useState<any>(null);
  const [cveId, setCveId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLatest();
  }, []);

  async function fetchLatest() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/getLatestCVE');
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
      else setData([]);
    } catch (e) {
      console.error(e);
      setError('Erreur de chargement des CVEs');
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
      const json = await res.json();
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
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Threat Intelligence – CVE Dashboard</h1>

      {/* Search bar */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <input
          placeholder="Rechercher un CVE ID (ex: CVE-2024-31880)"
          value={cveId}
          onChange={(e) => setCveId(e.target.value)}
          style={{
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            width: '300px',
          }}
        />
        <button
          onClick={() => fetchCVEById()}
          style={{
            padding: '0.75rem 1.25rem',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
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
            background: '#555',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Dernières CVEs
        </button>
      </div>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      {loading && <p style={{ marginTop: '1rem' }}>Chargement...</p>}

      {/* CVE Details */}
      {selectedCVE && !loading ? (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: '#fafafa',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            {selectedCVE.id || 'CVE Details'}
          </h2>
          <p style={{ color: '#555', marginBottom: '1rem' }}>
            {selectedCVE.description || selectedCVE.summary}
          </p>

          {/* CVSS and Weaknesses */}
          {selectedCVE.metrics?.cvssV3_1?.data?.score && (
            <div
              style={{
                background: '#eef7ff',
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '1rem',
              }}
            >
              <strong>CVSS Score:</strong> {selectedCVE.metrics.cvssV3_1.data.score} <br />
              <small>{selectedCVE.metrics.cvssV3_1.data.vector}</small>
            </div>
          )}

          {Array.isArray(selectedCVE.weaknesses) && selectedCVE.weaknesses.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Weaknesses:</strong> {selectedCVE.weaknesses.join(', ')}
            </div>
          )}

          {Array.isArray(selectedCVE.vendors) && selectedCVE.vendors.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Vendors:</strong> {selectedCVE.vendors.join(', ')}
            </div>
          )}

          <pre
            style={{
              background: '#f6f8fa',
              padding: '1rem',
              borderRadius: '6px',
              overflowX: 'auto',
            }}
          >
            {JSON.stringify(selectedCVE, null, 2)}
          </pre>
        </div>
      ) : null}

      {/* Latest CVEs Table */}
      {!selectedCVE && !loading && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Dernières vulnérabilités</h2>
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f2f2f2' }}>
                <tr>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Résumé</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Publié</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Modifié</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderTop: '1px solid #eee',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onClick={() => fetchCVEById(item.id)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    <td style={{ padding: '0.75rem', color: '#0070f3' }}>{item.id}</td>
                    <td
                      style={{
                        padding: '0.75rem',
                        maxWidth: '600px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.summary}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {item.Published ? new Date(item.Published).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {item.Modified ? new Date(item.Modified).toLocaleDateString() : 'N/A'}
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
