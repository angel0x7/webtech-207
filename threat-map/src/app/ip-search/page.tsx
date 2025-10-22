"use client";

import React, { useMemo, useState } from "react";
import {
  ShieldAlert,
  Loader2,
  Globe2,
  Network,
  Building2,
  Server,
  BarChart2,
  Download,
  Copy,
  Trash,
  ExternalLink,
  FileText,
} from "lucide-react";

/* -----------------------
   Types
   ----------------------- */
type LastAnalysisStats = {
  malicious?: number;
  suspicious?: number;
  harmless?: number;
  undetected?: number;
  timeout?: number;
};

type EngineResult = {
  method?: string;
  engine_name?: string;
  category?: string;
  result?: string | null;
};

type RDAP = {
  handle?: string;
  name?: string;
  links?: Array<{ href?: string }>;
  events?: Array<{ event_action?: string; event_date?: string }>;
};

/* -----------------------
   Utils
   ----------------------- */
const isValidIP = (v: string) =>
  /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}$/.test(v.trim());

const downloadJSON = (obj: any, name = "vt-ip.json") => {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadCSV = (rows: Array<Record<string, any>>, name = "engines.csv") => {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(",")]
    .concat(rows.map(r => keys.map(k => `"${(r[k] ?? "").toString().replace(/"/g, '""')}"`).join(",")))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

/* -----------------------
   Subcomponents
   ----------------------- */
function DonutChart({ stats }: { stats: LastAnalysisStats }) {
  const total = Object.values(stats).reduce((s, v) => s + (Number(v ?? 0) || 0), 0) || 1;
  const slices = [
    { label: "malicious", value: stats.malicious ?? 0, color: "#ef4444" },
    { label: "suspicious", value: stats.suspicious ?? 0, color: "#f59e0b" },
    { label: "harmless", value: stats.harmless ?? 0, color: "#10b981" },
    { label: "undetected", value: stats.undetected ?? 0, color: "#6b7280" },
  ].filter(s => s.value > 0);

  let acc = 0;
  const view = 80;
  return (
    <div className="flex items-center gap-4">
      <svg width={view} height={view} viewBox="0 0 42 42" className="rounded-full">
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#111827" strokeWidth="10" />
        {slices.map((s) => {
          const start = (acc / total) * 100;
          acc += s.value;
          const end = (acc / total) * 100;
          const dasharray = `${end - start} ${100 - (end - start)}`;
          const rotate = start * 3.6;
          return (
            <circle
              key={s.label}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={s.color}
              strokeWidth="10"
              strokeDasharray={dasharray}
              strokeDashoffset="25"
              transform={`rotate(${rotate} 21 21)`}
            />
          );
        })}
      </svg>

      <div className="text-sm">
        {["malicious", "suspicious", "harmless", "undetected"].map((k) => (
          <div key={k} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded"
              style={{
                background:
                  k === "malicious" ? "#ef4444" : k === "suspicious" ? "#f59e0b" : k === "harmless" ? "#10b981" : "#6b7280",
              }}
            />
            <span className="text-gray-300 capitalize">{k}</span>
            <span className="ml-2 font-medium text-white">{(stats as any)[k] ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnginesTable({ results }: { results?: Record<string, EngineResult> }) {
  const rows = useMemo(
    () =>
      Object.entries(results ?? {}).map(([engine, r]) => ({
        engine,
        category: r.category,
        result: r.result,
        method: r.method,
      })),
    [results]
  );

  const [q, setQ] = useState("");
  const [onlyMalicious, setOnlyMalicious] = useState(false);
  const filtered = rows.filter(
    r =>
      (!onlyMalicious || r.category === "malicious") &&
      (r.engine.toLowerCase().includes(q.toLowerCase()) || (r.category || "").toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-4">
      <div className="flex gap-2 items-center mb-3">
        <input
          placeholder="Filtrer moteurs ou catégorie"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm placeholder-gray-400"
        />
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyMalicious} onChange={() => setOnlyMalicious(s => !s)} className="accent-yellow-400" />
          <span>Seulement malicious</span>
        </label>
        <button onClick={() => downloadCSV(rows, "engines.csv")} className="px-3 py-2 bg-blue-600 rounded text-sm flex items-center gap-2">
          <Download className="w-4 h-4" /> CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-400">
            <tr>
              <th className="pb-2">Engine</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Result</th>
              <th className="pb-2">Method</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.engine} className="border-t border-gray-800">
                <td className={`py-2 ${r.category === "malicious" ? "font-semibold text-red-400" : ""}`}>{r.engine}</td>
                <td className="py-2 capitalize">{r.category ?? "-"}</td>
                <td className="py-2">{r.result ?? "-"}</td>
                <td className="py-2">{r.method ?? "-"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400">
                  Aucun moteur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RDAPPanel({ rdap, whois }: { rdap?: RDAP; whois?: string }) {
  const [openWhois, setOpenWhois] = useState(false);
  const events = rdap?.events ?? [];

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-400">RDAP Handle</div>
          <div className="font-medium">{rdap?.handle ?? "N/A"}</div>
          <div className="text-xs text-gray-400 mt-1">{rdap?.name ?? ""}</div>
        </div>
        <div className="flex gap-2">
          {rdap?.links?.slice?.(0, 3)?.map((l, i) => (
            <a key={i} href={l.href} target="_blank" rel="noreferrer" className="text-sm px-3 py-1 bg-gray-800 rounded flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              RDAP
            </a>
          ))}
          <button onClick={() => setOpenWhois(s => !s)} className="px-3 py-1 bg-blue-600 rounded flex items-center gap-2">
            <FileText className="w-4 h-4" /> WHOIS
          </button>
        </div>
      </div>

      {events.length > 0 && (
        <div className="text-sm">
          <div className="text-gray-400">Events</div>
          <ul className="list-disc ml-5 mt-2 text-xs text-gray-300">
            {events.map((e, i) => (
              <li key={i}>
                {e.event_action ?? "N/A"} — {e.event_date ? new Date(e.event_date).toLocaleString() : "N/A"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {openWhois && (
        <div className="bg-gray-800 p-3 rounded text-xs whitespace-pre-wrap text-gray-200">
          <div className="flex justify-end gap-2 mb-2">
            <button onClick={() => navigator.clipboard.writeText(whois ?? "")} className="px-2 py-1 bg-gray-700 rounded text-xs flex items-center gap-2">
              <Copy className="w-4 h-4" /> Copier
            </button>
            <button onClick={() => downloadJSON({ whois }, "whois.json")} className="px-2 py-1 bg-blue-600 rounded text-xs flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
          <pre className="text-xs">{whois ?? "N/A"}</pre>
        </div>
      )}
    </div>
  );
}


/* -----------------------
   Page principale
   ----------------------- */
export default function IPSearchPage(): React.JSX.Element {
  const [ip, setIp] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    if (!isValidIP(ip)) {
      setError("IP invalide. Format attendu : x.x.x.x (0-255).");
      return;
    }

    setLoading(true);
    setData(null);

    try {
      const res = await fetch(`/api/SearchIpInfo/${ip}`, { cache: "no-store" });
      if (!res.ok) {
        setError(`Erreur API (${res.status})`);
        return;
      }
      const json = await res.json();
      setData(json.data ?? json);
    } catch {
      setError("Erreur réseau ou serveur.");
    } finally {
      setLoading(false);
    }
  };

  const attr = data?.attributes;
  const stats: LastAnalysisStats = (attr?.last_analysis_stats as LastAnalysisStats) ?? {
    malicious: 0,
    suspicious: 0,
    harmless: 0,
    undetected: 0,
    timeout: 0,
  };

  const totalEngines: number = Object.values(stats).map(v => Number(v ?? 0)).reduce((acc, v) => acc + v, 0);
  const maliciousCount: number = Number(stats.malicious ?? 0);
  const maliciousPct = totalEngines > 0 ? ((maliciousCount / totalEngines) * 100).toFixed(1) : "0.0";
  const riskLabel = maliciousCount > 5 ? "Élevé" : maliciousCount > 0 ? "Modéré" : "Faible";
  const riskClass = maliciousCount > 5 ? "text-red-400" : maliciousCount > 0 ? "text-yellow-300" : "text-green-400";

  return (
    <main className="min-h-screen bg-[#0b0d2b] text-gray-100 p-8 font-sans">
      <div className="mx-auto max-w-6xl">
        {/* Header / Search */}
        <div className="flex gap-4 items-center mb-6">
          <div className="flex-1 flex gap-2">
            <input
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Ex : 185.243.96.105"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 focus:outline-none"
              aria-label="IP address"
            />
            <button onClick={handleSearch} disabled={loading} className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              {loading ? "Analyse..." : "Rechercher"}
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={() => data && downloadJSON(data, `${ip || "ip"}.json`)} className="px-3 py-2 bg-gray-800 rounded flex items-center gap-2" title="Exporter JSON">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => navigator.clipboard.writeText(ip || "")} className="px-3 py-2 bg-gray-800 rounded flex items-center gap-2" title="Copier IP">
              <Copy className="w-4 h-4" /> Copier
            </button>
            <button onClick={() => alert("Action Block IP placeholder (intégrer firewall API).")} className="px-3 py-2 bg-red-700 rounded flex items-center gap-2" title="Bloquer IP">
              <Trash className="w-4 h-4" /> Bloquer
            </button>
          </div>
        </div>

        {/* Feedback erreur */}
        {error && <div className="mb-4 p-3 bg-red-900/40 border border-red-700 text-red-200 rounded">{error}</div>}

        {/* Résultats */}
        {data && attr ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche : résumé réseau + actions */}
            <div className="space-y-6">
              <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-blue-300" />
                  <div>
                    <div className="text-xs text-gray-400">IP</div>
                    <div className="font-semibold">{data.id}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-gray-400 text-xs">ASN</div>
                    <div className="font-medium">{attr.asn ?? "N/A"}</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-gray-400 text-xs">Fournisseur</div>
                    <div className="font-medium">{attr.as_owner ?? "N/A"}</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-gray-400 text-xs">Pays</div>
                    <div className="font-medium">{attr.country ?? "N/A"}</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-gray-400 text-xs">CIDR</div>
                    <div className="font-medium">{attr.network ?? "N/A"}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400">Risque</div>
                    <div className={`font-semibold ${riskClass}`}>{riskLabel}</div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Dernière analyse
                    <div className="text-xs text-gray-400">
                      {attr.last_analysis_date ? new Date(attr.last_analysis_date * 1000).toLocaleString() : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <DonutChart stats={stats} />
                <div className="mt-2 text-xs text-gray-400">Malicious % : {maliciousPct}%</div>
              </div>

              <RDAPPanel rdap={attr.rdap as RDAP | undefined} whois={attr.whois} />
            </div>

            {/* Colonne centrale : engines / details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-blue-300" />
                    <div>
                      <div className="text-sm text-gray-400">Detections</div>
                      <div className="font-semibold">Résultats moteurs</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400">
                    Total moteurs: {totalEngines}
                    <span className="ml-4">Malicious: {stats.malicious ?? 0}</span>
                  </div>
                </div>

                <EnginesTable results={attr.last_analysis_results as Record<string, EngineResult> | undefined} />
              </div>

              {/* Catégories / tags */}
              <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-2">Catégorisation & tags</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(attr.categories ?? {}).length === 0 && (attr.tags ?? []).length === 0 ? (
                    <div className="text-gray-400">Aucune catégorie ni tag fourni</div>
                  ) : (
                    <>
                      {Object.entries(attr.categories ?? {}).map(([s, c]) => (
                        <span key={s} className="px-3 py-1 bg-gray-800 rounded text-xs border border-gray-700">
                          {s}: {String(c)}
                        </span>
                      ))}
                      {(attr.tags ?? []).map((t: string) => (
                        <span key={t} className="px-3 py-1 bg-blue-800/40 rounded text-xs border border-blue-700">
                          {t}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-20">Entrez une IP et cliquez sur Rechercher pour voir les résultats.</div>
        )}
      </div>
    </main>
  );
}
