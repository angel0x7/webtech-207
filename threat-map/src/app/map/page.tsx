


"use client";

  import Image from "next/image";
import { useEffect, useState } from "react";
import Globe3D from "./Globe";
import StatsPanel from "../components/StatsPanel";

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




if (loading)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0d2b] text-gray-200">
      <Image
        src="/honeyblog.png"
        alt="Chargement"
        width={160} // équivalent à w-40
        height={96} // équivalent à h-24
        className="mb-4 animate-pulse"
      />
      <p className="text-lg font-medium text-blue-400 animate-pulse">
        Chargement des données...
      </p>
    </div>
  );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );


  return (
    <div className="p-6 text-gray-100 bg-[#0b0d2b] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-blue-400">Bad Hosts</h1>

      <div className="mb-8">
        <Globe3D hosts={hosts} />
      </div>

      <StatsPanel hosts={hosts} />

      <table className="min-w-full border border-gray-700 rounded-lg bg-gray-900/60 text-sm">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="border border-gray-700 px-4 py-2 text-left">IP</th>
            <th className="border border-gray-700 px-4 py-2 text-center">Nombre</th>
            <th className="border border-gray-700 px-4 py-2 text-left">Dernière activité</th>
            <th className="border border-gray-700 px-4 py-2 text-left">Pays</th>
          </tr>
        </thead>
        <tbody>
          {hosts.map((host, i) => (
            <tr
              key={i}
              className="hover:bg-gray-800/70 transition-colors duration-150"
            >
              <td className="border border-gray-700 px-4 py-2">{host.remote_host}</td>
              <td className="border border-gray-700 px-4 py-2 text-center">{host.count}</td>
              <td className="border border-gray-700 px-4 py-2">{host.last_seen}</td>
              <td className="border border-gray-700 px-4 py-2">
                {host.geo?.country_name || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
