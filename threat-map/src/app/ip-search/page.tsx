"use client";

import { useState } from "react";

export default function IPSearchPage() {
  const [ip, setIp] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!ip.trim()) {
      setError("Veuillez entrer une adresse IP.");
      return;
    }

    setError(null);
    setData(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/SearchIpInfo/${ip}`, { cache: "no-store" });

      if (!res.ok) {
        setError(`Erreur API (${res.status})`);
        return;
      }

      const json = await res.json();
      setData(json.data || json);
    } catch {
      setError("Erreur réseau ou serveur.");
    } finally {
      setLoading(false);
    }
  };

  // extraction sécurisée des attributs VirusTotal
  const attr = data?.attributes;

  return (
    <main className="flex flex-col items-center justify-start p-6 min-h-screen text-white bg-[#0b0d2b]">
      <div className="flex items-center gap-2 mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Ex : 8.8.8.8"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="border border-gray-500 rounded-lg p-2 flex-1 bg-gray-800 text-white placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Chargement..." : "Rechercher"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 w-full max-w-md text-center">
          {error}
        </div>
      )}

      {data && attr && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">
            Résultat de l’analyse
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <p><span className="font-semibold text-gray-400">IP :</span> {data.id}</p>
            <p><span className="font-semibold text-gray-400">Pays :</span> {attr.country || "N/A"}</p>
            <p><span className="font-semibold text-gray-400">ASN :</span> {attr.asn || "N/A"}</p>
            <p><span className="font-semibold text-gray-400">Fournisseur :</span> {attr.as_owner || "N/A"}</p>
          </div>

          <h3 className="mt-5 mb-2 font-semibold text-blue-300">Statistiques VirusTotal</h3>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-red-800/40 p-2 rounded">
              <p className="font-semibold text-red-400">Malicious</p>
              <p>{attr.last_analysis_stats?.malicious ?? 0}</p>
            </div>
            <div className="bg-yellow-700/40 p-2 rounded">
              <p className="font-semibold text-yellow-300">Suspicious</p>
              <p>{attr.last_analysis_stats?.suspicious ?? 0}</p>
            </div>
            <div className="bg-green-800/40 p-2 rounded">
              <p className="font-semibold text-green-400">Harmless</p>
              <p>{attr.last_analysis_stats?.harmless ?? 0}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
