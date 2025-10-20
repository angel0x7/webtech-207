"use client";

import { useEffect, useState } from "react";

interface BadHost {
  remote_host: string;
  count: string;
  last_seen: string;
}

interface GeoData {
  city: string | null;
  country_iso: string | null;
  country_name: string | null;
  latitude: number | null;
  longitude: number | null;
  postal_code: string | null;
  region_iso: string | null;
  region_name: string | null;
}

interface Host extends BadHost {
  geo?: GeoData | null;
}

export default function MapPage() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHosts() {
      try {

        const res = await fetch("/api/bad-hosts");
        const data: Host[] = await res.json();

        if (!Array.isArray(data)) {
          setError("Erreur inconnue");
          setLoading(false);
          return;
        }

        setHosts(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Erreur de chargement");
        setLoading(false);
      }
    }

    fetchHosts();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bad Hosts (HoneyDB)</h1>
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">IP</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Dernière activité</th>
            <th className="border px-4 py-2">Pays</th>
          </tr>
        </thead>
        <tbody>
          {hosts.map((host, i) => (
            <tr key={i}>
              <td className="border px-4 py-2">{host.remote_host}</td>
              <td className="border px-4 py-2 text-center">{host.count}</td>
              <td className="border px-4 py-2">{host.last_seen}</td>
              <td className="border px-4 py-2">{host.geo?.country_name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
