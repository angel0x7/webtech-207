"use client";
import { useEffect, useState } from "react";

type Pulse = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  author_name: string;
  created: string;
};

type CVE = {
  id: string;
  summary: string;
  published?: string;
};

export default function ThreatsPage() {
  const [otx, setOtx] = useState<Pulse[]>([]);
  const [circl, setCircl] = useState<CVE[]>([]);
  const [kev, setKev] = useState<CVE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // AlienVault OTX
        const otxRes = await fetch("https://otx.alienvault.com/api/v1/pulses/activity", {
          headers: {
            "X-OTX-API-KEY": process.env.NEXT_PUBLIC_OTX_KEY ?? "",
          },
        });
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data: { results?: Pulse[] } = await res.json();
        setPulses(data.results ?? []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const categories = ["All", ...new Set(pulses.flatMap((p) => p.tags))];

  const filtered = pulses.filter((p) => {
    const matchesCategory = category === "All" || p.tags.includes(category);
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <p>Loading threat intelligence...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Threat Intelligence (AlienVault OTX)</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "0.5rem" }}>Filter by category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "0.5rem" }}>Search by name:</label>
        <input
          type="text"
          placeholder="Type to search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {filtered.map((p) => (
            <li key={p.id} style={{ marginBottom: "1rem" }}>
              <strong>{p.name}</strong> — {p.description}
            </li>
          ))}
        </ul>
      );
    }
    if (activeSource === "circl") {
      return (
        <ul>

          {circl.map((cve: any, idx: number) => (
            <li key={`${cve.id || idx}`} style={{ marginBottom: "1rem" }}>
              {/* CVE ID */}
              {cve.id && (
                <>
                  <strong>{cve.id}</strong>
                  <br />
                </>
              )}

              {/* Title */}
              {cve.title && (
                <>
                  <em>Title:</em> {cve.title}
                  <br />
                </>
              )}

              {/* Vendor */}
              {cve.vendor && (
                <>
                  <em>Vendor:</em> {cve.vendor}
                  <br />
                </>
              )}

              {/* Description */}
              {cve.description && <p>{cve.description}</p>}

              {/* CWE */}
              {cve.cwe && (
                <p>
                  <em>CWE:</em> {cve.cwe}
                </p>
              )}

              {/* CVSS */}
              {cve.cvss && (
                <p>
                  <em>CVSS:</em>{" "}
                  <span
                    style={{
                      color: cve.cvss >= 7 ? "red" : cve.cvss >= 4 ? "orange" : "green",
                    }}
                  >
                    {cve.cvss}
                  </span>{" "}
                  ({cve.severity})
                </p>
              )}

              {/* References */}
              {cve.references && cve.references.length > 0 && (
                <div>
                  <em>References:</em>
                  <ul>
                    {cve.references.map((ref: any, rIdx: number) => (
                      <li key={`ref-${idx}-${rIdx}`}>
                        <a href={ref.url || ref} target="_blank" rel="noopener noreferrer">
                          {ref.url || ref}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}






        </ul>
      );
    }
    if (activeSource === "kev") {
      return (
        <ul>
          {kev.map((v: any, idx: number) => (
            <li key={`${v.cveID}-${idx}`} style={{ marginBottom: "1rem" }}>
              <strong>{v.cveID}</strong> — {v.vulnerabilityName}
              <br />
              {v.vendorProject && (
                <>
                  <em>Vendor:</em> {v.vendorProject} | <em>Product:</em> {v.product}
                  <br />
                </>
              )}
              {v.dateAdded && (
                <p>
                  <em>Date Added:</em> {v.dateAdded}
                </p>
              )}
              {v.requiredAction && (
                <p>
                  <em>Required Action:</em> {v.requiredAction}
                </p>
              )}
              {v.notes && (
                <a href={v.notes} target="_blank" rel="noopener noreferrer">
                  More info
                </a>
              )}
            </li>
          ))}

        </ul>
      );
    }
    return <p>Select a source above to view data.</p>;
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Threat Intelligence Sources</h1>

      {/* Source selector */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <div
          onClick={() => setActiveSource("otx")}
          style={{
            flex: 1,
            padding: "1rem",
            border: "2px solid #333",
            cursor: "pointer",
            background: activeSource === "otx" ? "#eee" : "#fff",
            textAlign: "center",
          }}
        >
          AlienVault OTX
        </div>
        <div
          onClick={() => setActiveSource("circl")}
          style={{
            flex: 1,
            padding: "1rem",
            border: "2px solid #333",
            cursor: "pointer",
            background: activeSource === "circl" ? "#eee" : "#fff",
            textAlign: "center",
          }}
        >
          CIRCL CVE
        </div>
        <div
          onClick={() => setActiveSource("kev")}
          style={{
            flex: 1,
            padding: "1rem",
            border: "2px solid #333",
            cursor: "pointer",
            background: activeSource === "kev" ? "#eee" : "#fff",
            textAlign: "center",
          }}
        >
          KEV
        </div>
      </div>

      {/* Data display */}
      {renderContent()}
    </div>
  );
}
