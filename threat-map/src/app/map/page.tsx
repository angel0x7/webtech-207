"use client";

import { useEffect, useState } from "react";

interface BadHost {
  remote_host: string;
  count: string;
  last_seen: string;
}

export default function MapPage() {
  const [badHosts, setBadHosts] = useState<BadHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bad-hosts")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBadHosts(data);
        } else {
          setError(data.error || "Erreur inconnue");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Erreur de chargement");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">❌ {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bad Hosts (HoneyDB)</h1>
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">IP</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Dernière activité</th>
          </tr>
        </thead>
        <tbody>
          {badHosts.map((host, i) => (
            <tr key={i}>
              <td className="border px-4 py-2">{host.remote_host}</td>
              <td className="border px-4 py-2 text-center">{host.count}</td>
              <td className="border px-4 py-2">{host.last_seen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
