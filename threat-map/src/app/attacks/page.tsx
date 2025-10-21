"use client";

import { useEffect, useState } from "react";

type Indicator = {
  indicator: string;
  type: string;
  title?: string;
};

type Pulse = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  indicators: Indicator[];
};

export default function AttacksPage() {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPulses = async () => {
      try {
        const res = await fetch("https://otx.alienvault.com/api/v1/pulses/activity", {
          headers: {
            "X-OTX-API-KEY": process.env.NEXT_PUBLIC_OTX_KEY as string,
          },
        });
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        setPulses(data.results || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPulses();
  }, []);

  // Extract unique tags from pulses for category filter
  const categories = ["All", ...new Set(pulses.flatMap((p) => p.tags))];

  // Apply filters
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

      {/* Filters */}
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

      {/* Results */}
      {filtered.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {filtered.map((p) => (
            <li key={p.id} style={{ marginBottom: "1rem" }}>
              <strong>{p.name}</strong> — {p.description}
              <br />
              <em>Tags:</em> {p.tags.join(", ")}
              <br />
              <details>
                <summary>Indicators</summary>
                <ul>
                  {p.indicators.map((i, idx) => (
                    <li key={idx}>
                      {i.type}: {i.indicator} {i.title ? `(${i.title})` : ""}
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
