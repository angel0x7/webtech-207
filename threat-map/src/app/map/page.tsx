'use client';
import Layout from "../layout";
import { useEffect, useState } from 'react';

type BlacklistedIP = {
  ipAddress: string;
  abuseConfidenceScore: number;
  lastReportedAt: string;
};

type BlacklistResponse = {
  meta: {
    generatedAt: string;
  };
  data: BlacklistedIP[];
};

export default function Mapage() {
  const [ips, setIps] = useState<BlacklistedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [minScore, setMinScore] = useState(90);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBlacklist = async () => {
      try {
        const res = await fetch(
          `https://api.abuseipdb.com/api/v2/blacklist?confidenceMinimum=${minScore}`,
          {
            headers: {
              'keys': '45dd602e3d8b497f14500edee23ee4fdfbfb138addcc42b49b4ae8de7cc94fc7d04fcaba6e2ad894',
              Accept: 'application/json',
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data: BlacklistResponse = await res.json();
        setIps(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlacklist();
  }, [minScore]);

  const filtered = ips.filter((ip) =>
    ip.ipAddress.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Chargement des IPs blacklistées...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
      <>
    
        <div style={{ padding: '2rem' }}>
          <h1>🛡️ IPs Blacklistées (AbuseIPDB)</h1>

          {/* Filtres */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '0.5rem' }}>Score minimum :</label>
            <select value={minScore} onChange={(e) => setMinScore(Number(e.target.value))}>
              {[100, 95, 90, 85, 80, 75].map((score) => (
                <option key={score} value={score}>
                  {score}%
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '0.5rem' }}>Recherche IP :</label>
            <input
              type="text"
              placeholder="Ex: 192.168..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Résultats */}
          {filtered.length === 0 ? (
            <p>Aucune IP trouvée.</p>
          ) : (
            <ul>
              {filtered.map((ip, index) => (
                <li key={index} style={{ marginBottom: '1rem' }}>
                  <strong>{ip.ipAddress}</strong> — Score : {ip.abuseConfidenceScore}%
                  <br />
                  <em>Signalée le :</em>{' '}
                  {new Date(ip.lastReportedAt).toLocaleString('fr-FR')}
                </li>
              ))}
            </ul>
          )}
        </div>
      </>
  );
}
