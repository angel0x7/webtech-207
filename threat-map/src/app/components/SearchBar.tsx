"use client";

import React, { useState } from "react";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(`https://www.virustotal.com/api/v3/ip_addresses/${query}`, {
        headers: {
          "x-apikey": process.env.NEXT_PUBLIC_VT_API_KEY as string, // stocke ta clé dans .env.local
        },
      });
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
      const json = await response.json();
      setData(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ color: "white", fontFamily: "sans-serif" }}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="IP address..."
          style={{
            width: "200px",
            height: "32px",
            borderRadius: "20px",
            paddingLeft: "50px",
            border: "none",
            outline: "none",
            color: "#fff",
            backgroundColor: "#555",
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: "10px",
            height: "32px",
            borderRadius: "20px",
            backgroundColor: "#00b894",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          <p><strong>IP:</strong> {data.id}</p>
          <p><strong>Pays:</strong> {data.attributes.country}</p>
          <p><strong>ASN:</strong> {data.attributes.asn}</p>
          <p><strong>Fournisseur:</strong> {data.attributes.as_owner}</p>
          <p><strong>Malicious:</strong> {data.attributes.last_analysis_stats.malicious}</p>
          <p><strong>Suspicious:</strong> {data.attributes.last_analysis_stats.suspicious}</p>
          <p><strong>Harmless:</strong> {data.attributes.last_analysis_stats.harmless}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
